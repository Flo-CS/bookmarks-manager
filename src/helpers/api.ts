import {BookmarkData, BookmarkMinimum} from "./bookmarks";
import {CollectionData, CollectionMinimum} from "./collections";
import {WebsiteData} from "./websiteData";

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
    "fetchSiteData": { params: [string, boolean], result: WebsiteData }
}
type APIRequest<T extends keyof APIRequestMessage> = (...params: APIRequestMessage[T]["params"]) => Promise<APIRequestMessage[T]["result"]>
type APIRequests = {
    [T in keyof APIRequestMessage]: APIRequest<T>;
};

export class ElectronAPI implements APIRequests {

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

    async getCollections(): Promise<CollectionData[]> {
        return await window.bridge.sendMessage("getCollections")
    }

    async addCollection(collection: CollectionMinimum | CollectionData): Promise<CollectionData> {
        return await window.bridge.sendMessage("addCollection", collection)
    }

    async updateCollection(id: string, collection: Partial<CollectionData>): Promise<CollectionData> {
        return await window.bridge.sendMessage("updateCollection", id, collection)
    }

    async removeCollection(id: string, removeAction: "removeChildren" | "moveChildren" = "removeChildren") {
        return await window.bridge.sendMessage("removeCollection", id, removeAction)
    }

    async fetchSiteData(url: string, forceDataRefresh = false): Promise<WebsiteData> {
        return await window.bridge.sendMessage("fetchSiteData", url, forceDataRefresh)
    }


}
