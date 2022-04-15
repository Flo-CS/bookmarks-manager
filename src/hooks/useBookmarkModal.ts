import { useMemo, useState } from "react";

export default function useBookmarkModal<B extends { id: string }>(bookmarks: B[]) {
    const [isOpen, setIsOpen] = useState(false);
    const [bookmarkId, setBookmarkId] = useState<string | null>(null);

    function closeModal() {
        setIsOpen(false);
        setBookmarkId(null);
    }

    function openModal(bookmarkId: string) {
        setIsOpen(true);
        setBookmarkId(bookmarkId);
    }

    const bookmark = useMemo(() => {
        return bookmarks.find(b => b.id === bookmarkId);
    }, [bookmarkId])

    return [isOpen, bookmark, openModal, closeModal] as const
}