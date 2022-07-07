import { useState } from "react";

interface Classifiable {
    id: string,
    collection: string
}

export default function useClassifiableItems<T extends Classifiable>(initItems: T[]) {
    const [items, setItems] = useState<T[]>(initItems);

    function getItem(id: string): T | undefined {
        return items.find(b => b.id === id);
    }

    function updateItem(id: string, newData: Partial<T>): void {
        const item = getItem(id);
        if (item) {
            const newItems = items.map(b => b.id === id ? { ...b, ...newData } : b);
            setItems(newItems);
        }
    }

    function removeItem(id: string): void {
        const newItems = items.filter(b => b.id !== id);
        setItems(newItems);
    }

    function addItem(newItem: T): void {
        const newItems = [...items, newItem];
        setItems(newItems);
    }

    return { items, getItem, updateItem, removeItem, addItem, setItems };
}