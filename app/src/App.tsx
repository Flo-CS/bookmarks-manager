import React, { useCallback, useMemo, useState } from "react";
import styled, { ThemeProvider } from "styled-components";

import { flatten, isEqual, slice, uniq } from "lodash";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { IoAlbums, IoTrash } from "react-icons/io5";
import { MdAllInbox } from "react-icons/md";
import { AddBookmarkData, BookmarkData, UpdateBookmarkData } from "../types/bookmarks";
import { IdDroppedItem } from "../types/dragAndDrop";
import { createDefaultBookmark } from "../utils/bookmarks";
import {
    createDefaultCollection,
    getNewCollectionParentId,
    TopCollections,
    VirtualCollections
} from "../utils/collections";
import { DndItems } from "../utils/dragAndDrop";
import { ElectronApi } from "./api/ElectronApi";
import BookmarkModal from "./components/BookmarkModal";
import BookmarksLayout from "./components/BookmarksLayout";
import CollectionName from "./components/CollectionName";
import CollectionsBreadCrumb from "./components/CollectionsBreadCrumb";
import CollectionsTree from "./components/CollectionsTree";
import CollectionTreeItem, { CollectionsTreeRightMenuRenderProps } from "./components/CollectionTreeItem";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import { useMyApi } from "./hooks/useMyApi";
import useModal from "./hooks/useModal";
import { GlobalStyle } from "./styles/GlobalStyle";
import { theme } from "./styles/Theme";
import Menu from "./components/Menu";
import { isInSpecialCollection } from "../utils/collections";
import { TextInput } from "./components/TextInput";
import Fuse from "fuse.js";
import { useFuzzySearch } from "./hooks/useFuzzySearch";
import { Copy } from "../types/helpersTypes";


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

const API = new ElectronApi();

export function App() {
    const { data: {
        bookmarks,
        getCollection,
        getCollectionChildren,
        getBookmark,
        getPathToCollection
    }, actions: apiActions
    } = useMyApi(API)


    const [selectedCollectionId, setSelectedCollectionId] = useState<string>(VirtualCollections.ALL);
    const [nameEditedCollectionId, setNameEditedCollectionId] = useState<string | undefined>(undefined);

    const [isEditModalOpen, editModalBookmarkId, openEditModal, closeEditModal] = useModal<string>();
    const editModalBookmark = editModalBookmarkId ? getBookmark(editModalBookmarkId) : undefined
    const [isNewModalOpen, newModalBookmark, openNewModal, closeNewModal] = useModal<AddBookmarkData>();

    const [searchText, setSearchText] = useState("")

    const allTags = useMemo(() => uniq(flatten(bookmarks.map(bookmark => bookmark.tags ?? []))), [bookmarks])
    const selectedCollectionPath = getPathToCollection(selectedCollectionId)

    const allBookmarks = useMemo(() => {
        return bookmarks.filter(bookmark => !isInSpecialCollection(getPathToCollection(bookmark.collection), TopCollections.TRASH));
    }, [bookmarks, isInSpecialCollection, getPathToCollection])

    const selectedBookmarks = useMemo(() => {
        return bookmarks.filter(bookmark => bookmark.collection === selectedCollectionId);
    }, [bookmarks, selectedCollectionId])

    const bookmarksToShow = useMemo(() => {
        if (selectedCollectionId === VirtualCollections.ALL) {
            return allBookmarks
        }
        return selectedBookmarks
    }, [allBookmarks, selectedBookmarks, selectedCollectionId]);

    const searchBookmarksResults = useFuzzySearch<Copy<BookmarkData>>(searchText, bookmarksToShow, { keys: ["tags", "siteName", "linkTitle", "description", "url"], ignoreLocation: true, threshold: 0.3 })

    async function handleAddCollection(name: string) {
        const collectionParentId = getNewCollectionParentId(selectedCollectionPath)
        const collectionIndex = getCollectionChildren(collectionParentId).length
        const newCollection = createDefaultCollection(name, collectionParentId, collectionIndex)

        await apiActions.addCollection(newCollection)
    }

    async function handleRemoveCollection(id: string) {
        await apiActions.moveCollection({
            movingCollectionId: id,
            newParent: TopCollections.TRASH,
        })
    }

    async function handleRemoveCollectionFromTrash(id: string) {
        await apiActions.removeCollection(id)
    }

    async function handleRestoreCollectionFromTrash(id: string) {
        await apiActions.moveCollection({
            movingCollectionId: id,
            newParent: TopCollections.MAIN,
        })
    }

    function handleSelectCollection(id: string) {
        setSelectedCollectionId(id)
    }

    async function handleDropOnCollection(newParentId: string, droppedItem: IdDroppedItem) {
        switch (droppedItem.type) {
            case DndItems.BOOKMARK: {
                return await apiActions.updateBookmark(droppedItem.id, { collection: newParentId })
            }
            case DndItems.COLLECTION:
                return await apiActions.moveCollection({
                    movingCollectionId: droppedItem.id,
                    newParent: newParentId,
                    newIndex: droppedItem.index
                })
        }
    }

    function canDropOnCollection(newParentId: string, droppedItem: IdDroppedItem) {
        const newParentPath = getPathToCollection(newParentId)
        const currentPath = getPathToCollection(droppedItem.id)

        if (droppedItem.type === DndItems.COLLECTION) {
            // Can't drop on itself
            if (isEqual(newParentPath, currentPath)) return false
            // Can't drop collection inside itself
            if (currentPath.every(pathItem => newParentPath.includes(pathItem))) return false
        }
        return true

    }

    function handleAddBookmark() {
        openNewModal(createDefaultBookmark(selectedCollectionPath));
    }

    function handleBookmarkEdit(id: string) {
        openEditModal(id)
    }

    async function handleEditModalSave(data: UpdateBookmarkData | undefined) {
        if (!editModalBookmarkId || !data) return

        await apiActions.updateBookmark(editModalBookmarkId, data)
        closeEditModal()
    }

    async function handleNewModalSave(data: AddBookmarkData | undefined) {
        if (!data) return

        await apiActions.addBookmark(data)
        closeNewModal()
    }

    async function handleRemoveBookmarkTag(id: string, tag: string) {
        const bookmark = getBookmark(id);
        if (!bookmark) return;

        const newTags = bookmark.tags?.filter(t => t !== tag);
        await apiActions.updateBookmark(bookmark.id, { tags: newTags })
    }

    async function handleRemoveBookmark(id: string) {
        const bookmark = getBookmark(id)
        if (!bookmark) return;

        if (bookmark.collection === TopCollections.TRASH) {
            return await apiActions.removeBookmark(id)
        }
        return apiActions.updateBookmark(id, { collection: TopCollections.TRASH })
    }

    async function handleAfterFoldCollection(id: string, isFolded: boolean) {
        await apiActions.updateCollection(id, { isFolded: isFolded })
    }

    async function handleModalFetchWebsiteMetadata(url: string, forceDataRefresh: boolean) {
        const { metadata: { title, description, pictures } } = await apiActions.getWebsite(url, forceDataRefresh)
        return {
            linkTitle: title,
            description: description,
            faviconPath: pictures.favicon?.url,
            previewPath: pictures.preview?.url
        }
    }

    async function handleAfterChangeCollectionName(newName: string, id: string) {
        await apiActions.updateCollection(id, { name: newName })
        setNameEditedCollectionId(undefined)
    }

    function handleSearchTextInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        setSearchText(e.currentTarget.value)
    }

    const trashCollectionsTreeMenu = useCallback(({ position, isOpened, closeMenu, collectionId }: CollectionsTreeRightMenuRenderProps) => {
        return <Menu position={position} onClose={closeMenu} isShow={isOpened}>
            <Menu.Item onClick={() => {
                handleSelectCollection(TopCollections.TRASH)
                handleRemoveCollectionFromTrash(collectionId)
            }}>Delete</Menu.Item>
            <Menu.Item onClick={() => handleRestoreCollectionFromTrash(collectionId)}>Restore</Menu.Item>
        </Menu>
    }, [handleSelectCollection, handleRemoveCollectionFromTrash, handleRestoreCollectionFromTrash])

    const mainCollectionsMenuItems = useCallback(({ position, isOpened, closeMenu, collectionId }: CollectionsTreeRightMenuRenderProps) => {
        return <Menu position={position} onClose={closeMenu} isShow={isOpened}>
            <Menu.Item onClick={() => handleRemoveCollection(collectionId)}>Remove</Menu.Item>
            <Menu.Item onClick={() => setNameEditedCollectionId(collectionId)}>Rename</Menu.Item>
        </Menu>
    }, [handleRemoveCollection, setNameEditedCollectionId])

    const collectionNames = useMemo(() => {
        return slice(selectedCollectionPath, 1).map(collection => {
            return <CollectionName
                key={collection.id}
                collectionId={collection.id}
                name={collection.name}
                icon={collection.icon}
                onClick={handleSelectCollection} />
        })
    }, [selectedCollectionPath])

    return (
        <DndProvider backend={HTML5Backend}>
            <ThemeProvider theme={theme}>
                <GlobalStyle />
                <TagsContext.Provider value={allTags}>
                    <Layout className="app">
                        <Sidebar
                            onCollectionAdd={handleAddCollection}
                            topChildren={
                                <CollectionsTree
                                    onCollectionClick={handleSelectCollection}
                                    selectedCollectionId={selectedCollectionId}>
                                    <CollectionTreeItem
                                        collectionId={VirtualCollections.ALL}
                                        name="All"
                                        icon={MdAllInbox}
                                        count={allBookmarks.length}
                                    />
                                    <CollectionTreeItem
                                        collectionId={TopCollections.MAIN}
                                        name="Without collection"
                                        icon={IoAlbums}
                                        onDrop={handleDropOnCollection}
                                        canDrop={canDropOnCollection}
                                        count={getCollection(TopCollections.MAIN).count}
                                    />
                                    <CollectionTreeItem
                                        collectionId={TopCollections.TRASH}
                                        name="Trash"
                                        icon={IoTrash}
                                        isDefaultFolded={true}
                                        canDrop={canDropOnCollection}
                                        onDrop={handleDropOnCollection}
                                        count={getCollection(TopCollections.TRASH).count}>
                                        <CollectionsTree
                                            collections={getCollectionChildren(TopCollections.TRASH)}
                                            selectedCollectionId={selectedCollectionId}
                                            onCollectionClick={handleSelectCollection}
                                            rightMenu={trashCollectionsTreeMenu}
                                            afterCollectionFoldingChange={handleAfterFoldCollection}
                                        />
                                    </CollectionTreeItem>
                                </CollectionsTree>
                            }
                            bottomChildren={
                                <CollectionsTree
                                    collections={getCollectionChildren(TopCollections.MAIN)}
                                    selectedCollectionId={selectedCollectionId}
                                    onCollectionClick={handleSelectCollection}
                                    afterCollectionFoldingChange={handleAfterFoldCollection}
                                    rightMenu={mainCollectionsMenuItems}
                                    onDrop={handleDropOnCollection}
                                    canDrop={canDropOnCollection}
                                    nameEditedCollectionId={nameEditedCollectionId}
                                    afterCollectionNameChange={handleAfterChangeCollectionName}
                                />
                            }
                        />
                        <Main>
                            <TextInput value={searchText} onChange={handleSearchTextInputChange} />
                            <TopBar onAdd={handleAddBookmark} />
                            <CollectionsBreadCrumb>
                                {collectionNames}
                            </CollectionsBreadCrumb>
                            <BookmarksLayout
                                bookmarks={searchBookmarksResults}
                                onTagRemove={handleRemoveBookmarkTag}
                                onDelete={handleRemoveBookmark}
                                onEdit={handleBookmarkEdit} />
                        </Main>
                        <BookmarkModal
                            isOpen={isEditModalOpen}
                            onClose={closeEditModal}
                            onBookmarkSave={handleEditModalSave}
                            modalTitle="Edit bookmark"
                            initialBookmark={editModalBookmark}
                            fetchWebsiteMetadata={handleModalFetchWebsiteMetadata} />
                        <BookmarkModal
                            isOpen={isNewModalOpen}
                            onClose={closeNewModal}
                            onBookmarkSave={handleNewModalSave}
                            modalTitle="Add new bookmark"
                            initialBookmark={newModalBookmark}
                            fetchWebsiteMetadata={handleModalFetchWebsiteMetadata} />
                    </Layout>
                </TagsContext.Provider>
            </ThemeProvider>
        </DndProvider>
    )
}
