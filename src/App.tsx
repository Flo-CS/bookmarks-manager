import React, {useEffect, useMemo, useState} from "react";
import styled, {ThemeProvider} from "styled-components";
import BookmarkModal from "./components/BookmarkModal";
import BookmarksLayout from "./components/BookmarksLayout";
import CollectionName from "./components/CollectionName";
import CollectionsBreadCrumb from "./components/CollectionsBreadCrumb";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import {ElectronAPI} from "./helpers/api";
import {BookmarkData, createDefaultBookmark, ModalBookmark} from "./helpers/bookmarks";
import {createDefaultCollection, TopCollections, TreeInputCollection, VirtualCollections} from "./helpers/collections";
import useIdModal from "./hooks/useIdModal";
import useCollectionsItems from "./hooks/useCollectionsItems";
import useTree from "./hooks/useTree";
import {GlobalStyle} from "./styles/GlobalStyle";
import {theme} from "./styles/Theme";
import {flatten, slice, uniq} from "lodash";

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

const API = new ElectronAPI();


const COLLECTIONS_TREE_ROOTS = [{
    name: TopCollections.TRASH,
    id: TopCollections.TRASH,
}, {
    name: TopCollections.MAIN,
    id: TopCollections.MAIN,
}]

export function App(): JSX.Element {
    const [selectedCollectionId, setSelectedCollectionId] = useState<string>(VirtualCollections.ALL);

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
        leafChildren: bookmarks,
        getKey: (collection) => collection.id,
        getParent: (collection) => collection.parent,
        getLeafChildParent: (bookmark) => bookmark.collection
    })

    const [isEditModalOpen, editModalBookmark, openEditModal, closeEditModal] = useIdModal<ModalBookmark>(bookmarks);
    const [isNewModalOpen, newModalBookmark, openNewModal, closeNewModal] = useIdModal<ModalBookmark>();

    const allTags = useMemo(() => uniq(flatten(bookmarks.map(bookmark => bookmark.tags))), [bookmarks])
    const selectedCollectionPath = useMemo(() => getPathToCollection(selectedCollectionId), [selectedCollectionId])
    const bookmarksToShow = useMemo(() => {
        if (selectedCollectionId === VirtualCollections.ALL) {
            return bookmarks.filter(bookmark => bookmark.collection !== TopCollections.TRASH);
        }
        return selectedBookmarks;
    }, [bookmarks, selectedBookmarks]);

    useEffect(() => {
        API.getBookmarks().then(fetchedBookmarks => {
            setBookmarks(fetchedBookmarks)
        })
        API.getCollections().then(fetchedCollections => {
            insertCollections(fetchedCollections)
        })
    }, [])

    function handleAddCollection(name: string) {
        const newCollection = createDefaultCollection(name, selectedCollectionPath)
        API.addCollection(newCollection).then(createdCollection => {
            insertCollection(createdCollection)
        })
    }

    function handleRemoveCollection(id: string, isDefinitiveDelete: boolean) {
        if (isDefinitiveDelete) {
            API.removeCollection(id).then(() => {
                removeCollection(id)
            })
        } else {
            API.updateCollection(id, {parent: TopCollections.TRASH}).then((updatedCollection) => {
                updateCollection(id, updatedCollection)
            })
        }
    }

    function handleRemoveTrashCollection(id: string) {
        API.removeCollection(id).then(() => {
            removeCollection(id)
        })
    }

    function handleCollectionSelection(collectionId: string) {
        setSelectedCollectionId(collectionId)
    }

    function handleBookmarkCreation() {
        const newBookmark = createDefaultBookmark(selectedCollectionPath);
        openNewModal(newBookmark);
    }

    function handleBookmarkEdit(id: string) {
        openEditModal(id)
    }

    function handleEditModalSave(data: Partial<BookmarkData>) {
        if (!editModalBookmark) return;

        API.updateBookmark(editModalBookmark.id, data).then((updatedBookmark) => {
            updateBookmark(editModalBookmark.id, updatedBookmark)
        })
        closeEditModal()
    }

    function handleNewModalSave(data: Partial<BookmarkData>) {
        if (!newModalBookmark) return;

        const newBookmark = {...newModalBookmark, ...data}
        API.addBookmark(newBookmark).then((createdBookmark) => {
            addBookmark(createdBookmark)
            closeNewModal()
        })
    }

    function handleBookmarkTagRemove(id: string, tag: string) {
        const bookmark = getBookmark(id);
        if (!bookmark) return;

        const newTags = bookmark.tags.filter(t => t !== tag);
        API.updateBookmark(bookmark.id, {tags: newTags}).then((updatedBookmark) => {
            updateBookmark(bookmark.id, updatedBookmark)
        })

    }

    function handleBookmarkDelete(id: string) {
        const bookmark = getBookmark(id)
        if (!bookmark) return;

        if (bookmark.collection === TopCollections.TRASH) {
            API.removeBookmark(id).then(() => {
                removeBookmark(id)
            })
        } else {
            API.updateBookmark(id, {collection: TopCollections.TRASH}).then((updatedBookmark) => {
                updateBookmark(id, updatedBookmark)
            })
        }
    }

    function handleCollectionFolding(id: string, isFolded: boolean) {
        API.updateCollection(id, {isFolded: isFolded})
    }

    return (
        <ThemeProvider theme={theme}>
            <GlobalStyle/>
            <TagsContext.Provider value={allTags}>
                <Layout className="app">
                    <Sidebar mainCollections={getCollectionChildren(TopCollections.MAIN)}
                             trashCollections={getCollectionChildren(TopCollections.TRASH)}
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
                            {slice(selectedCollectionPath, 1).map(collection => {
                                return <CollectionName key={collection.id} name={collection.name}
                                                       icon={collection.icon}/>
                            })}
                        </CollectionsBreadCrumb>
                        <BookmarksLayout bookmarks={bookmarksToShow} onTagRemove={handleBookmarkTagRemove}
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
