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
import {
    BookmarkForDatabase,
    BookmarkUserComplement,
    CompleteBookmark,
    createDefaultBookmark
} from "./helpers/bookmarks";
import {BookmarksCollection, createDefaultCollection, SpecialsCollections} from "./helpers/collections";
import useBookmarkModal from "./hooks/useBookmarkModal";
import useBookmarks from "./hooks/useBookmarks";
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
        itemsRoot: collectionsRoot,
        insertItem: insertCollection,
        getPathTo,
        setItems: setCollections
    } = useTree<string, BookmarksCollection>(SpecialsCollections.ROOT)

    const [selectedCollectionId, setSelectedCollectionId] = useState<string>(SpecialsCollections.ALL);
    const {
        bookmarks,
        selectedBookmarks,
        removeBookmark,
        updateBookmark,
        getBookmark,
        addBookmark,
        setBookmarks
    } = useBookmarks<CompleteBookmark>([], selectedCollectionId);

    const [isEditModalOpen, editModalBookmark, openEditModal, closeEditModal] = useBookmarkModal<BookmarkForDatabase>(bookmarks);
    const [isNewModalOpen, newModalBookmark, openNewModal, closeNewModal] = useBookmarkModal<BookmarkForDatabase>();

    useEffect(() => {
        async function fetchBookmarks() {
            const bookmarks = await bookmarkApi.getBookmarks()
            setBookmarks(bookmarks)
        }

        async function fetchCollections() {
            const collections = await collectionApi.getCollections()
            setCollections(collections)
        }

        fetchBookmarks()
        fetchCollections()
    }, [])


    function handleAddCollection(name: string) {
        const newCollection = createDefaultCollection(name, selectedCollectionId)
        collectionApi.addCollection(newCollection).then(collection => {
            insertCollection(collection)
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

    function handleEditModalSave(data: Partial<BookmarkUserComplement>) {
        if (editModalBookmark) {
            bookmarkApi.updateBookmark(editModalBookmark.id, data).then((newBookmark) => {
                updateBookmark(editModalBookmark.id, newBookmark)
            })
            closeEditModal()
        }
    }

    function handleNewModalSave(data: Partial<BookmarkUserComplement>) {
        if (newModalBookmark) {
            const newBookmark = {...newModalBookmark, ...data}
            bookmarkApi.addBookmark(newBookmark).then((bookmark) => {
                addBookmark(bookmark)
                closeNewModal()
            })
        }
    }

    function handleBookmarkTagRemove(id: string, tag: string) {
        const bookmark = getBookmark(id);
        if (bookmark) {
            const newTags = bookmark.tags.filter(t => t !== tag);
            bookmarkApi.updateBookmark(bookmark.id, {tags: newTags}).then((newBookmark) => {
                updateBookmark(bookmark.id, newBookmark)
            })
        }
    }

    function handleBookmarkDelete(id: string) {
        bookmarkApi.removeBookmark(id).then(() => {
            removeBookmark(id)
        })
    }

    function handleCollectionFolding(id: string, isFolded: boolean) {
        collectionApi.updateCollection(id, {isFolded: isFolded})
    }

    const allTags = useMemo(() => uniq(flatten(bookmarks.map(bookmark => bookmark.tags))), [bookmarks])
    const selectedCollectionPath = useMemo(() => getPathTo(selectedCollectionId), [selectedCollectionId])

    return (
        <ThemeProvider theme={theme}>
            <GlobalStyle/>
            <TagsContext.Provider value={allTags}>
                <Layout className="app">
                    <Sidebar collections={{main: collectionsRoot.children || []}}
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
