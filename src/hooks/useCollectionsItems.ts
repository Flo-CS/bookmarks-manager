import {useMemo, useState} from "react";
import {SpecialsCollections} from "../helpers/collections";

export default function useCollectionsItems<T extends { id: string, collection: string }>(initItems: T[], selectedCollectionId: string) {
    const [items, setItems] = useState<T[]>(initItems);

    function getItem(id?: string) {
        return items.find(b => b.id === id);
    }

    function updateItem(id?: string, newData?: Partial<T>) {
        const item = getItem(id);
        if (item) {
            const newItems = items.map(b => b.id === id ? {...b, ...newData} : b);
            setItems(newItems);
        }
    }

    function removeItem(id?: string) {
        const newItems = items.filter(b => b.id !== id);
        setItems(newItems);
    }

    function addItem(newItem: T) {
        const newItems = [...items, newItem];
        setItems(newItems);
    }

    const selectedItems = useMemo(() => items.filter(b => {
        if (selectedCollectionId === SpecialsCollections.ALL) {
            return true;
        }

        return b.collection === selectedCollectionId
    }), [items, selectedCollectionId])


    return {items, selectedItems, getItem, updateItem, removeItem, addItem, setItems};
}