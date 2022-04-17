import { useState } from "react";

// Todo: make this more generic
export default function useBookmarks<B extends { id: string }>(initBookmarks: B[]) {
    const [bookmarks, setBookmarks] = useState(initBookmarks);

    function getBookmark(id?: string) {
        return bookmarks.find(b => b.id === id);
    }

    function updateBookmark(id?: string, newData?: Partial<B>) {
        const bookmark = getBookmark(id);
        if (bookmark) {
            const newBookmarks = bookmarks.map(b => b.id === id ? { ...b, ...newData } : b);
            setBookmarks(newBookmarks);
        }
    }

    function removeBookmark(id?: string) {
        const newBookmarks = bookmarks.filter(b => b.id !== id);
        setBookmarks(newBookmarks);
    }

    function addBookmark(newBookmark: B) {
        const newBookmarks = [...bookmarks, newBookmark];
        setBookmarks(newBookmarks);
    }

    return { bookmarks, getBookmark, updateBookmark, removeBookmark, addBookmark };
}