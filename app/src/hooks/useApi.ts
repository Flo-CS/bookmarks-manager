import { useEffect } from "react";
import { Api } from "../../types/api";
import { AddBookmarkData, BookmarkData, UpdateBookmarkData } from "../../types/bookmarks";
import { AddCollectionData, CollectionDataExtended, MoveCollectionData, UpdateCollectionData } from "../../types/collections";
import { Copy } from "../../types/helpersTypes";
import { WebsiteData } from "../../types/website";
import { COLLECTIONS_TREE_ROOTS } from "../../utils/collections";
import useClassifiableItems from "./useClassifiableItems";
import useTree from "./useTree";

export function useApi(API: Api) {
    const {
        items: bookmarks,
        removeItem: _removeBookmark,
        updateItem: _updateBookmark,
        getItem: getBookmark,
        addItem: _addBookmark,
        setItems: _setBookmarks
    } = useClassifiableItems<BookmarkData>([]);

    const {
        getTreeNodeChildren: getCollectionChildren,
        insertNode: _insertCollection,
        getPathToTreeNode: getPathToCollection,
        removeNode: _removeCollection,
        updateNode: _updateCollection,
        updateNodes: _updateCollections,
        insertNodes: _insertCollections,
    } = useTree<Copy<CollectionDataExtended>>({
        rootNodes: COLLECTIONS_TREE_ROOTS,
        leafChildren: bookmarks,
        getKey: (collection) => collection.id,
        getParent: (collection) => collection.parent,
        getLeafChildParent: (bookmark) => bookmark.collection
    })

    useEffect(() => {
        (async () => {
            const fetchedCollections = await API.getCollections()
            _insertCollections(fetchedCollections)
            const fetchedBookmarks = await API.getBookmarks()
            _setBookmarks(fetchedBookmarks)
        })()
    }, [])


    async function addCollection(newCollection: AddCollectionData): Promise<void> {
        const [createdCollection, updatedCollections] = await API.addCollection(newCollection)
        _insertCollection(createdCollection)
        _updateCollections(updatedCollections)
    }

    async function moveCollection(collectionMove: MoveCollectionData): Promise<void> {
        const reorderedCollections = await API.moveCollection(collectionMove)
        _updateCollections(reorderedCollections)
    }

    async function updateCollection(id: string, collectionUpdates: UpdateCollectionData): Promise<void> {
        const updatedCollection = await API.updateCollection(id, collectionUpdates)
        _updateCollection(id, updatedCollection)
    }

    async function removeCollection(id: string): Promise<void> {
        const reorderedCollections = await API.removeCollection(id)
        _removeCollection(id)
        _updateCollections(reorderedCollections)
    }

    async function updateBookmark(id: string, bookmarkUpdates: UpdateBookmarkData): Promise<void> {
        const updatedBookmark = await API.updateBookmark(id, bookmarkUpdates)
        _updateBookmark(id, updatedBookmark)
    }

    async function addBookmark(newBookmark: AddBookmarkData): Promise<void> {
        const createdBookmark = await API.addBookmark(newBookmark)
        _addBookmark(createdBookmark)
    }

    async function removeBookmark(id: string): Promise<void> {
        await API.removeBookmark(id)
        _removeBookmark(id)
    }

    async function getWebsite(URL: string, forceDataRefresh = false): Promise<WebsiteData> {
        return API.getWebsite(URL, forceDataRefresh)
    }

    return {
        actions: {
            addCollection,
            moveCollection,
            updateCollection,
            removeCollection,
            addBookmark,
            updateBookmark,
            removeBookmark,
            getWebsite,
        },
        data: {
            getBookmark,
            bookmarks,
            getCollectionChildren,
            getPathToCollection
        }
    }
}