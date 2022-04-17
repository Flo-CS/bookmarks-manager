import { BookmarkForDatabase, CompleteBookmark } from "./bookmarks";
import { ipcRenderer } from "electron";

export interface BookmarkAPI {
    removeBookmark(id: string): Promise<void>;
    addBookmark(bookmark: BookmarkForDatabase): Promise<CompleteBookmark>;
    getBookmarks(): Promise<CompleteBookmark[]>;
    getBookmark(id: string): Promise<CompleteBookmark>;
    updateBookmark(id: string, bookmark: BookmarkForDatabase): Promise<CompleteBookmark>;
}

export class ElectronBookmarkAPI implements BookmarkAPI {
    async removeBookmark(id: string): Promise<void> {
        return await ipcRenderer.invoke("removeBookmark", id);
    }

    async addBookmark(bookmark: BookmarkForDatabase): Promise<CompleteBookmark> {
        return await ipcRenderer.invoke("addBookmark", bookmark);
    }

    async getBookmarks(): Promise<CompleteBookmark[]> {
        return await ipcRenderer.invoke("getBookmarks");
    }

    async getBookmark(id: string): Promise<CompleteBookmark> {
        return await ipcRenderer.invoke("getBookmark", id);
    }

    async updateBookmark(id: string, bookmark: BookmarkForDatabase): Promise<CompleteBookmark> {
        return await ipcRenderer.invoke("updateBookmark", id, bookmark);
    }
}
