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
import {BookmarkData, createDefaultBookmark, ModalBookmark} from "./helpers/bookmarks";
import {createDefaultCollection, SpecialsCollections, TreeInputCollection} from "./helpers/collections";
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

const COLLECTIONS_TREE_ROOTS = [{
    name: SpecialsCollections.TRASH,
    id: SpecialsCollections.TRASH,
}, {
    name: SpecialsCollections.MAIN,
    id: SpecialsCollections.MAIN,
}]

export function App(): JSX.Element {
    const [selectedCollectionId, setSelectedCollectionId] = useState<string>(SpecialsCollections.ALL);

    const {
        items: bookmarks,
        selectedItems: selectedBookmarks,
        removeItem: removeBookmark,
        updateItem: updateBookmark,
        getItem: getBookmark,
        addItem: addBookmark,
        setItems: setBookmarks
    } = useCollectionsItems<BookmarkData>([], selectedCollectionId);

    const {
        getTreeNodeChildren: getCollectionChildren,
        insertNode: insertCollection,
        getPathToTreeNode: getPathToCollection,
        removeNode: removeCollection,
        updateNode: updateCollection,
        insertNodes: insertCollections,
    } = useTree<TreeInputCollection>({
        rootNodes: COLLECTIONS_TREE_ROOTS,
        getKey: (collection) => collection.id,
        getParent: (collection) => collection.parent,
    })

    const [isEditModalOpen, editModalBookmark, openEditModal, closeEditModal] = useIdModal<ModalBookmark>(bookmarks);
    const [isNewModalOpen, newModalBookmark, openNewModal, closeNewModal] = useIdModal<ModalBookmark>();

    useEffect(() => {
        bookmarkApi.getBookmarks().then(fetchedBookmarks => {
            setBookmarks(fetchedBookmarks)
        })
        collectionApi.getCollections().then(fetchedCollections => {
            insertCollections(fetchedCollections)
        })
    }, [])


    function handleAddCollection(name: string) {
        const newCollection = createDefaultCollection(name, selectedCollectionId)
        collectionApi.addCollection(newCollection).then(createdCollection => {
            insertCollection(createdCollection)
        })
    }

    function handleRemoveCollection(id: string, isDefinitiveDelete: boolean) {
        if (isDefinitiveDelete) {
            collectionApi.removeCollection(id).then(() => {
                removeCollection(id)
            })
        } else {
            collectionApi.updateCollection(id, {parent: SpecialsCollections.TRASH}).then((updatedCollection) => {
                updateCollection(id, updatedCollection)
            })
        }
    }

    function handleRemoveTrashCollection(id: string) {
        collectionApi.removeCollection(id).then(() => {
            removeCollection(id)
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

    function handleEditModalSave(data: Partial<BookmarkData>) {
        if (!editModalBookmark) return;

        bookmarkApi.updateBookmark(editModalBookmark.id, data).then((updatedBookmark) => {
            updateBookmark(editModalBookmark.id, updatedBookmark)
        })
        closeEditModal()
    }

    function handleNewModalSave(data: Partial<BookmarkData>) {
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
            bookmarkApi.updateBookmark(id, {collection: SpecialsCollections.TRASH}).then((updatedBookmark) => {
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
                    <Sidebar mainCollections={getCollectionChildren(SpecialsCollections.MAIN)}
                             trashCollections={getCollectionChildren(SpecialsCollections.TRASH)}
                             collectionsItems={bookmarks}
                             onCollectionAdd={handleAddCollection}
                             onCollectionRemove={handleRemoveCollection}
                             onTrashCollectionRemove={handleRemoveTrashCollection}
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
