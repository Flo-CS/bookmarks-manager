import {BookmarkData, BookmarkMinimum} from "./bookmarks";
import {CollectionData, CollectionMinimum} from "./collections";


export class ElectronBookmarkAPI {
    async removeBookmark(id: string): Promise<void> {
        return await window.bridge.sendMessage("removeBookmark", id);
    }

    async addBookmark(bookmark: BookmarkMinimum | BookmarkData): Promise<BookmarkData> {
        return await window.bridge.sendMessage("addBookmark", bookmark);
    }

    async getBookmarks(): Promise<BookmarkData[]> {
        return await window.bridge.sendMessage("getBookmarks");
    }

    async getBookmark(id: string): Promise<BookmarkData> {
        return await window.bridge.sendMessage("getBookmark", id);
    }

    async updateBookmark(id: string, bookmark: Partial<BookmarkData>): Promise<BookmarkData> {
        return await window.bridge.sendMessage("updateBookmark", id, bookmark);
    }
}

export class ElectronCollectionAPI {
    async getCollections(): Promise<CollectionData[]> {
        return await window.bridge.sendMessage("getCollections")
    }

    async addCollection(collection: CollectionMinimum | CollectionData): Promise<CollectionData> {
        return await window.bridge.sendMessage("addCollection", collection)
    }

    async updateCollection(id: string, collection: Partial<CollectionData>): Promise<CollectionData> {
        return await window.bridge.sendMessage("updateCollection", id, collection)
    }

    async removeCollection(id: string) {
        return await window.bridge.sendMessage("removeCollection", id)
    }
}