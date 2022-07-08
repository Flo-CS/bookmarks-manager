import { useMemo } from "react";
import { endOf, parseNaturalLanguageDateString, startOf } from "../../utils/dates";

type UseParseNaturalDateStringResult = {
    startDate: Date;
    endDate: Date;
    matchedText: string;
    hasResult: true,
} | {
    startDate: null,
    endDate: null,
    matchedText: "",
    hasResult: false,
};

export default function useParseNaturalDateString(text: string): UseParseNaturalDateStringResult {
    const [startDate, endDate, matchedText] = useMemo(() => {
        const parseResult = parseNaturalLanguageDateString(text)
        if (!parseResult) return [null, null, ""];

        const matchedText = parseResult.matchedText || "";
        const startDate = startOf(parseResult.start, parseResult.smallestCertainUnit || "hour");
        const endDate = parseResult.end || endOf(startDate, parseResult.smallestCertainUnit || "hour");

        return [startDate, endDate, matchedText]
    }, [text]);

    if (startDate && endDate) {
        return { startDate, endDate, matchedText, hasResult: true }
    }
    return { startDate: null, endDate: null, matchedText: "", hasResult: false };
}