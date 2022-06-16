import {BookmarkForDatabase, BookmarkUserComplement, CompleteBookmark} from "./bookmarks";
import {CollectionData} from "./collections";


export class ElectronBookmarkAPI {
    async removeBookmark(id: string): Promise<void> {
        return await window.bridge.sendMessage("removeBookmark", id);
    }

    async addBookmark(bookmark: BookmarkForDatabase): Promise<CompleteBookmark> { // TODO: Change interface used here
        return await window.bridge.sendMessage("addBookmark", bookmark);
    }

    async getBookmarks(): Promise<CompleteBookmark[]> {
        return await window.bridge.sendMessage("getBookmarks");
    }

    async getBookmark(id: string): Promise<CompleteBookmark> {
        return await window.bridge.sendMessage("getBookmark", id);
    }

    async updateBookmark(id: string, bookmark: Partial<BookmarkUserComplement>): Promise<CompleteBookmark> {
        return await window.bridge.sendMessage("updateBookmark", id, bookmark);
    }
}

export class ElectronCollectionAPI {
    async getCollections(): Promise<CollectionData[]> {
        return await window.bridge.sendMessage("getCollections")
    }

    async addCollection(collection: CollectionData): Promise<CollectionData> {
        return await window.bridge.sendMessage("addCollection", collection)
    }

    async updateCollection(id: string, collection: Partial<CollectionData>): Promise<CollectionData> {
        return await window.bridge.sendMessage("updateCollection", id, collection)
    }
}