import {BookmarkData, BookmarkMinimum} from "../bookmarks";
import {CollectionData, CollectionMinimum, CollectionRemoveAction} from "../collections";
import {ApiRequestsSenders} from "./Api";

export class ElectronApi implements ApiRequestsSenders {

    async removeBookmark(id: string) {
        return await window.bridge.sendAPIRequest("removeBookmark", id);
    }

    async addBookmark(bookmark: BookmarkMinimum | BookmarkData) {
        return await window.bridge.sendAPIRequest("addBookmark", bookmark);
    }

    async getBookmarks() {
        return await window.bridge.sendAPIRequest("getBookmarks");
    }

    async updateBookmark(id: string, bookmark: Partial<BookmarkData>) {
        return await window.bridge.sendAPIRequest("updateBookmark", id, bookmark);
    }

    async getCollections() {
        return await window.bridge.sendAPIRequest("getCollections")
    }

    async addCollection(collection: CollectionMinimum | CollectionData) {
        return await window.bridge.sendAPIRequest("addCollection", collection)
    }

    async updateCollection(id: string, collection: Partial<CollectionData>) {
        return await window.bridge.sendAPIRequest("updateCollection", id, collection)
    }

    async reorderCollections(id: string, newParentId: string, newIndex: number) {
        return await window.bridge.sendAPIRequest("reorderCollections", id, newParentId, newIndex)
    }

    async removeCollection(id: string, removeAction: CollectionRemoveAction = "removeChildren") {
        return await window.bridge.sendAPIRequest("removeCollection", id, removeAction)
    }

    async fetchWebsiteData(url: string, forceDataRefresh = false) {
        return await window.bridge.sendAPIRequest("fetchWebsiteData", url, forceDataRefresh)
    }
}
