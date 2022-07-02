import {BookmarkData, BookmarkMinimum} from "./bookmarks";
import {CollectionData, CollectionMinimum, CollectionRemoveAction, OrderedCollection} from "./collections";
import {WebsiteData} from "./websiteData";

export type APIRequestMessages = {
    "removeBookmark": { params: [string], result: void }
    "addBookmark": { params: [BookmarkMinimum | BookmarkData], result: BookmarkData },
    "getBookmarks": { params: [], result: BookmarkData[] }
    "getBookmark": { params: [string], result: BookmarkData },
    "updateBookmark": { params: [string, Partial<BookmarkData>], result: BookmarkData },
    "getCollections": { params: [], result: CollectionData[] },
    "addCollection": { params: [CollectionMinimum | CollectionData], result: CollectionData },
    "updateCollection": { params: [string, Partial<CollectionData>], result: CollectionData };
    "reorderCollections": { params: [string, string, number], result: OrderedCollection[] }
    "removeCollection": { params: [string, CollectionRemoveAction], result: void },
    "fetchWebsiteData": { params: [string, boolean], result: WebsiteData }
}
type APIRequest<T extends keyof APIRequestMessages> = (...params: APIRequestMessages[T]["params"]) => Promise<APIRequestMessages[T]["result"]>
type APIRequests = {
    [T in keyof APIRequestMessages]: APIRequest<T>;
};

export class ElectronAPI implements APIRequests {

    async removeBookmark(id: string) {
        return await window.bridge.sendMessage("removeBookmark", id);
    }

    async addBookmark(bookmark: BookmarkMinimum | BookmarkData) {
        return await window.bridge.sendMessage("addBookmark", bookmark);
    }

    async getBookmarks() {
        return await window.bridge.sendMessage("getBookmarks");
    }

    async getBookmark(id: string) {
        return await window.bridge.sendMessage("getBookmark", id);
    }

    async updateBookmark(id: string, bookmark: Partial<BookmarkData>) {
        return await window.bridge.sendMessage("updateBookmark", id, bookmark);
    }

    async getCollections() {
        return await window.bridge.sendMessage("getCollections")
    }

    async addCollection(collection: CollectionMinimum | CollectionData) {
        return await window.bridge.sendMessage("addCollection", collection)
    }

    async updateCollection(id: string, collection: Partial<CollectionData>) {
        return await window.bridge.sendMessage("updateCollection", id, collection)
    }

    async reorderCollections(id: string, newParentId: string, newIndex: number) {
        return await window.bridge.sendMessage("reorderCollections", id, newParentId, newIndex)
    }

    async removeCollection(id: string, removeAction: CollectionRemoveAction = "removeChildren") {
        return await window.bridge.sendMessage("removeCollection", id, removeAction)
    }

    async fetchWebsiteData(url: string, forceDataRefresh = false) {
        return await window.bridge.sendMessage("fetchWebsiteData", url, forceDataRefresh)
    }
}
