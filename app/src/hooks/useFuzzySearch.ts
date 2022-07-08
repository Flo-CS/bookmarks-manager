import Fuse from "fuse.js";
import { useEffect, useMemo } from "react";
import { GenericObject, NestedPaths } from "../../types/helpersTypes";

interface SearchOptions<Item extends GenericObject> {
    keys: NestedPaths<Item>[],
    ignoreLocation: boolean,
    threshold: number,
}

export function useFuzzySearch<Item extends GenericObject>(searchTerm: string, items: Item[], options: Partial<SearchOptions<Item>>): Item[] {
    const fuse = useMemo(() => {
        return new Fuse<Item>([], options as Fuse.IFuseOptions<Item>);
    }, []);

    useEffect(() => {
        fuse.setCollection(items)
    }, [items])

    const searchResults = useMemo(() => {
        if (!searchTerm) return items;
        const results = fuse.search(searchTerm)
        return results.map(result => result.item)
    }, [searchTerm, fuse, items])

    return searchResults
}