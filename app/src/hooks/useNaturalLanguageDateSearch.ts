import { isWithinInterval } from "date-fns";
import { useMemo } from "react";
import useParseNaturalDateString from "./useParseNaturalDateString";

export default function useNaturalLanguageDateSearch<Item, DateKey extends keyof Item = keyof Item>(searchText: string, items: Item[], dateKey: DateKey) {
    const { startDate, endDate, matchedText, hasResult } = useParseNaturalDateString(searchText);

    const filteredItems = useMemo(() => items.filter(item => {
        if (!itemHasDate(item)) return false;
        return isMatchWithSearch(item[dateKey])
    }), [items, searchText]);

    function isMatchWithSearch(date: Date) {
        if (!hasResult) return true;
        return isWithinInterval(date, { start: startDate, end: endDate });
    }

    function itemHasDate(item: Item): item is Item & { [key in DateKey]: Date } {
        return item[dateKey] instanceof Date;
    }

    return [filteredItems, matchedText] as const
}