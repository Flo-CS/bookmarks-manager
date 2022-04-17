import { useMemo, useState } from "react";

export default function useBookmarkModal<B extends { id: string }>(bookmarks?: B[]) {
    const [isOpen, setIsOpen] = useState(false);
    const [bookmarkId, setBookmarkId] = useState<string | B | undefined>(undefined);

    function closeModal() {
        setIsOpen(false);
        setBookmarkId(undefined);
    }

    function openModal(bookmarkId: string | B) {
        setIsOpen(true);
        setBookmarkId(bookmarkId);
    }

    const bookmark = useMemo(() => {
        if (typeof bookmarkId === "string") {
            return bookmarks?.find(b => b.id === bookmarkId);
        }
        return bookmarkId;
    }, [bookmarkId])

    return [isOpen, bookmark, openModal, closeModal] as const
}