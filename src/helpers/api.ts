import {BookmarkForDatabase, BookmarkUserComplement, CompleteBookmark} from "./bookmarks";

export interface BookmarkAPI {
    removeBookmark(id: string): Promise<void>;

    addBookmark(bookmark: BookmarkForDatabase): Promise<CompleteBookmark>;

    getBookmarks(): Promise<CompleteBookmark[]>;

    getBookmark(id: string): Promise<CompleteBookmark>;

    updateBookmark(id: string, bookmark: Partial<BookmarkUserComplement>): Promise<CompleteBookmark>;
}

export class ElectronBookmarkAPI implements BookmarkAPI {
    async removeBookmark(id: string): Promise<void> {
        return await window.Main.sendMessage("removeBookmark", id);
    }

    async addBookmark(bookmark: BookmarkForDatabase): Promise<CompleteBookmark> {
        return await window.Main.sendMessage("addBookmark", bookmark);
    }

    async getBookmarks(): Promise<CompleteBookmark[]> {
        return await window.Main.sendMessage("getBookmarks");
    }

    async getBookmark(id: string): Promise<CompleteBookmark> {
        return await window.Main.sendMessage("getBookmark", id);
    }

    async updateBookmark(id: string, bookmark: Partial<BookmarkUserComplement>): Promise<CompleteBookmark> {
        return await window.Main.sendMessage("updateBookmark", id, bookmark);
    }
}
