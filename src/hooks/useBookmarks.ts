import { useMemo, useState } from "react";
import { BookmarkMinimal } from "../helpers/bookmarks";
import { SpecialFolders } from "../helpers/folders";

// Todo: make this more generic
export default function useBookmarks<B extends BookmarkMinimal>(initBookmarks: B[], selectedFolderId: string) {
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
        newBookmark.collection = selectedFolderId;
        if (selectedFolderId in SpecialFolders) {
            newBookmark.collection = SpecialFolders.WITHOUT_FOLDER;
        }

        const newBookmarks = [...bookmarks, newBookmark];
        setBookmarks(newBookmarks);
    }

    const selectedBookmarks = useMemo(() => bookmarks.filter(b => {
        if (selectedFolderId === SpecialFolders.ALL) {
            return true;
        }

        return b.collection === selectedFolderId
    }), [bookmarks, selectedFolderId])


    return { bookmarks, selectedBookmarks, getBookmark, updateBookmark, removeBookmark, addBookmark };
}