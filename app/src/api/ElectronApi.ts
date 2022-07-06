import {ApiRequestsSenders} from "../../types/api";
import {AddBookmarkData, UpdateBookmarkData} from "../../types/bookmarks";
import {AddCollectionData, MoveCollectionData, UpdateCollectionData} from "../../types/collections";

export class ElectronApi implements ApiRequestsSenders {

    async removeBookmark(id: string) {
        return await window.bridge.sendAPIRequest("removeBookmark", id);
    }

    async addBookmark(bookmark: AddBookmarkData) {
        return await window.bridge.sendAPIRequest("addBookmark", bookmark);
    }

    async getBookmarks() {
        return await window.bridge.sendAPIRequest("getBookmarks");
    }

    async updateBookmark(id: string, bookmark: UpdateBookmarkData) {
        return await window.bridge.sendAPIRequest("updateBookmark", id, bookmark);
    }

    async getCollections() {
        return await window.bridge.sendAPIRequest("getCollections")
    }

    async addCollection(collection: AddCollectionData) {
        return await window.bridge.sendAPIRequest("addCollection", collection)
    }

    async updateCollection(id: string, collection: UpdateCollectionData) {
        return await window.bridge.sendAPIRequest("updateCollection", id, collection)
    }

    async moveCollection(moveCollection: MoveCollectionData) {
        return await window.bridge.sendAPIRequest("moveCollection", moveCollection)
    }

    async removeCollection(id: string) {
        return await window.bridge.sendAPIRequest("removeCollection", id)
    }

    async getWebsite(url: string, forceDataRefresh = false) {
        return await window.bridge.sendAPIRequest("getWebsite", url, forceDataRefresh)
    }
}
