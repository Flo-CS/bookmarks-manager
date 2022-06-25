import {BookmarkData, BookmarkMinimum} from "./bookmarks";
import {CollectionData, CollectionMinimum} from "./collections";
import {BookmarkWebsiteData} from "./bookmarkWebsiteData";

export type APIRequestMessage = {
    "removeBookmark": { params: [string], result: void }
    "addBookmark": { params: [BookmarkMinimum | BookmarkData], result: BookmarkData },
    "getBookmarks": { params: [], result: BookmarkData[] }
    "getBookmark": { params: [string], result: BookmarkData },
    "updateBookmark": { params: [string, Partial<BookmarkData>], result: BookmarkData },
    "getCollections": { params: [], result: CollectionData[] },
    "addCollection": { params: [CollectionMinimum | CollectionData], result: CollectionData },
    "updateCollection": { params: [string, Partial<CollectionData>], result: CollectionData };
    "removeCollection": { params: [string, "removeChildren" | "moveChildren"], result: void },
    "fetchWebsiteData": { params: [string, boolean], result: BookmarkWebsiteData }
}
type APIRequest<T extends keyof APIRequestMessage> = (...params: APIRequestMessage[T]["params"]) => Promise<APIRequestMessage[T]["result"]>
type APIRequests = {
    [T in keyof APIRequestMessage]: APIRequest<T>;
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

    async removeCollection(id: string, removeAction: "removeChildren" | "moveChildren" = "removeChildren") {
        return await window.bridge.sendMessage("removeCollection", id, removeAction)
    }

    async fetchWebsiteData(url: string, forceDataRefresh = false) {
        return await window.bridge.sendMessage("fetchWebsiteData", url, forceDataRefresh)
    }


}
