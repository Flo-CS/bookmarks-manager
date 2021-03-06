import Fuse from "fuse.js";
import { useEffect, useMemo } from "react";
import { GenericObject, NestedPaths } from "../../types/helpersTypes";

interface SearchOptions<Item> {
    keys: Item extends GenericObject ? NestedPaths<Item>[] : never,
    ignoreLocation: boolean,
    threshold: number,
    minMatchCharLength: number,
}

export function useFuzzySearch<Item extends GenericObject | string>(searchText: string, items: Item[], options?: Partial<SearchOptions<Item>>, limit: number = Number.MAX_SAFE_INTEGER): Item[] {
    const fuse = useMemo(() => {
        return new Fuse<Item>([], { ...options as Fuse.IFuseOptions<Item> });
    }, []);

    useEffect(() => {
        fuse.setCollection(items)
    }, [items])

    const searchResults = useMemo(() => {
        if (!searchText) return items;
        const results = fuse.search(searchText, { limit: limit })
        return results.map(result => result.item)
    }, [searchText, fuse, items])

    return searchResults
}