import {flatten, uniq} from "lodash";
import React, {useEffect, useMemo, useState} from "react";
import styled, {ThemeProvider} from "styled-components";
import BookmarkModal from "./components/BookmarkModal";
import BookmarksLayout from "./components/BookmarksLayout";
import CollectionName from "./components/CollectionName";
import CollectionsBreadCrumb from "./components/CollectionsBreadCrumb";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import {ElectronBookmarkAPI, ElectronCollectionAPI} from "./helpers/api";
import {Bookmark, BookmarkData, createDefaultBookmark} from "./helpers/bookmarks";
import {Collection, createDefaultCollection, SpecialsCollections} from "./helpers/collections";
import useIdModal from "./hooks/useIdModal";
import useCollectionsItems from "./hooks/useCollectionsItems";
import useTree from "./hooks/useTree";
import {GlobalStyle} from "./styles/GlobalStyle";
import {theme} from "./styles/Theme";

const Layout = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  width: 100%;
  height: 100%;
`

const Main = styled.main`
  overflow-y: auto;
  height: 100%;
  padding: ${props => props.theme.spacing.medium};
`

export const TagsContext = React.createContext<string[]>([]);

const bookmarkApi = new ElectronBookmarkAPI();
const collectionApi = new ElectronCollectionAPI()

// Temporary code, only for the MVP creation process*
export function App() {
    const {
        getItems: getCollections,
        insertItem: insertCollection,
        getPathTo: getPathToCollection,
        setItems: setCollections
    } = useTree<string, Collection>(SpecialsCollections.ROOT)

    const {
        getItems: getTrash
    } = useTree<string, Collection>(SpecialsCollections.TRASH)

    const [selectedCollectionId, setSelectedCollectionId] = useState<string>(SpecialsCollections.ALL);
    const {
        items: bookmarks,
        selectedItems: selectedBookmarks,
        removeItem: removeBookmark,
        updateItem: updateBookmark,
        getItem: getBookmark,
        addItem: addBookmark,
        setItems: setBookmarks
    } = useCollectionsItems<Bookmark>([], selectedCollectionId);


    const [isEditModalOpen, editModalBookmark, openEditModal, closeEditModal] = useIdModal<BookmarkData>(bookmarks);
    const [isNewModalOpen, newModalBookmark, openNewModal, closeNewModal] = useIdModal<BookmarkData>();

    useEffect(() => {
        async function fetchBookmarks() {
            const fetchedBookmarks = await bookmarkApi.getBookmarks()
            setBookmarks(fetchedBookmarks)
        }

        async function fetchCollections() {
            const fetchedCollections = await collectionApi.getCollections()
            setCollections(fetchedCollections)
        }

        fetchBookmarks()
        fetchCollections()
    }, [])


    function handleAddCollection(name: string) {
        const newCollection = createDefaultCollection(name, selectedCollectionId)
        collectionApi.addCollection(newCollection).then(createdCollection => {
            insertCollection(createdCollection)
        })
    }

    function handleCollectionSelection(collectionId: string) {
        setSelectedCollectionId(collectionId)
    }

    function handleBookmarkCreation() {
        const newBookmark = createDefaultBookmark(selectedCollectionId);
        openNewModal(newBookmark);
    }

    function handleBookmarkEdit(id: string) {
        openEditModal(id)
    }

    function handleEditModalSave(data: Partial<Bookmark>) {
        if (!editModalBookmark) return;

        bookmarkApi.updateBookmark(editModalBookmark.id, data).then((updatedBookmark) => {
            updateBookmark(editModalBookmark.id, updatedBookmark)
        })
        closeEditModal()
    }

    function handleNewModalSave(data: Partial<Bookmark>) {
        if (!newModalBookmark) return;

        const newBookmark = {...newModalBookmark, ...data}
        bookmarkApi.addBookmark(newBookmark).then((createdBookmark) => {
            addBookmark(createdBookmark)
            closeNewModal()
        })
    }

    function handleBookmarkTagRemove(id: string, tag: string) {
        const bookmark = getBookmark(id);
        if (!bookmark) return;

        const newTags = bookmark.tags.filter(t => t !== tag);
        bookmarkApi.updateBookmark(bookmark.id, {tags: newTags}).then((updatedBookmark) => {
            updateBookmark(bookmark.id, updatedBookmark)
        })

    }

    function handleBookmarkDelete(id: string) {
        const bookmark = getBookmark(id)
        if (!bookmark) return;

        if (bookmark.collection === SpecialsCollections.TRASH) {
            bookmarkApi.removeBookmark(id).then(() => {
                removeBookmark(id)
            })
        } else {
            const newCollection = {collection: SpecialsCollections.TRASH}
            bookmarkApi.updateBookmark(id, newCollection).then((updatedBookmark) => {
                updateBookmark(id, updatedBookmark)
            })
        }
    }

    function handleCollectionFolding(id: string, isFolded: boolean) {
        collectionApi.updateCollection(id, {isFolded: isFolded})
    }

    const allTags = useMemo(() => uniq(flatten(bookmarks.map(bookmark => bookmark.tags))), [bookmarks])
    const selectedCollectionPath = useMemo(() => getPathToCollection(selectedCollectionId), [selectedCollectionId])

    return (
        <ThemeProvider theme={theme}>
            <GlobalStyle/>
            <TagsContext.Provider value={allTags}>
                <Layout className="app">
                    <Sidebar collections={{main: getCollections(), trash: getTrash()}}
                             onCollectionAdd={handleAddCollection}
                             afterCollectionFoldingChange={handleCollectionFolding}
                             onSelectedCollectionChange={handleCollectionSelection}
                             selectedCollectionId={selectedCollectionId}/>
                    <Main>
                        <TopBar onAdd={handleBookmarkCreation}/>
                        <CollectionsBreadCrumb>
                            {selectedCollectionPath.map(collection => {
                                return <CollectionName key={collection.id} name={collection.name}
                                                       icon={collection.icon}/>
                            })}
                        </CollectionsBreadCrumb>
                        <BookmarksLayout bookmarks={selectedBookmarks} onTagRemove={handleBookmarkTagRemove}
                                         onDelete={handleBookmarkDelete} onEdit={handleBookmarkEdit}/>
                    </Main>
                    <BookmarkModal
                        isOpen={isEditModalOpen}
                        onClose={closeEditModal}
                        onBookmarkSave={handleEditModalSave}
                        title="Edit bookmark"
                        originalBookmark={editModalBookmark}/>
                    <BookmarkModal
                        isOpen={isNewModalOpen}
                        onClose={closeNewModal}
                        onBookmarkSave={handleNewModalSave}
                        title="Add new bookmark"
                        originalBookmark={newModalBookmark}/>
                </Layout>
            </TagsContext.Provider>
        </ThemeProvider>
    )
}
