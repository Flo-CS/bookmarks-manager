import {useMemo, useState} from "react";

export default function useIdModal<T extends { id: string }>(items?: T[]) {
    const [isOpen, setIsOpen] = useState(false);
    const [itemId, setItemId] = useState<string | T | undefined>(undefined);

    function closeModal() {
        setIsOpen(false);
        setItemId(undefined);
    }

    function openModal(itemId: string | T) {
        setIsOpen(true);
        setItemId(itemId);
    }

    const item = useMemo(() => {
        if (typeof itemId === "string") {
            return items?.find(b => b.id === itemId);
        }
        return itemId;
    }, [itemId])

    return [isOpen, item, openModal, closeModal] as const
}