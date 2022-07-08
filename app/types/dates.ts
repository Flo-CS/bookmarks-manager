import { Nullable } from "./helpersTypes"

export type TimeUnit = "year" | "month" | "day" | "hour" | "minute" | "second";

export type ParseNaturalLanguageDateStringResult = Nullable<{
    start: Date,
    end?: Date,
    smallestCertainUnit?: TimeUnit,
    matchedText: string
}>

