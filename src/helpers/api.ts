import { BookmarkForDatabase, BookmarkFromDatabase } from "./bookmarks";
import { ipcRenderer } from "electron";

export interface BookmarkAPI {
    removeBookmark(id: string): Promise<void>;
    addBookmark(bookmark: BookmarkForDatabase): Promise<BookmarkFromDatabase>;
    getBookmarks(): Promise<BookmarkFromDatabase[]>;
    getBookmark(id: string): Promise<BookmarkFromDatabase>;
    updateBookmark(id: string, bookmark: BookmarkForDatabase): Promise<BookmarkFromDatabase>;
}

export class ElectronBookmarkAPI implements BookmarkAPI {
    async removeBookmark(id: string): Promise<void> {
        return await ipcRenderer.invoke("removeBookmark", id);
    }

    async addBookmark(bookmark: BookmarkForDatabase): Promise<BookmarkFromDatabase> {
        return await ipcRenderer.invoke("addBookmark", bookmark);
    }

    async getBookmarks(): Promise<BookmarkFromDatabase[]> {
        return await ipcRenderer.invoke("getBookmarks");
    }

    async getBookmark(id: string): Promise<BookmarkFromDatabase> {
        return await ipcRenderer.invoke("getBookmark", id);
    }

    async updateBookmark(id: string, bookmark: BookmarkForDatabase): Promise<BookmarkFromDatabase> {
        return await ipcRenderer.invoke("updateBookmark", id, bookmark);
    }
}
