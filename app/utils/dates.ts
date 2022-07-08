import * as chrono from 'chrono-node'
import { endOfDay, endOfHour, endOfMinute, endOfMonth, endOfSecond, endOfYear, startOfDay, startOfHour, startOfMinute, startOfMonth, startOfSecond, startOfYear } from 'date-fns';
import { ParseNaturalLanguageDateStringResult, TimeUnit } from '../types/dates';

export const TIME_UNITS: TimeUnit[] = ['year', 'month', 'day', 'hour', 'minute', 'second'];

export const START_OF_UNIT_FUNCTIONS: Record<TimeUnit, (date: Date) => Date> = {
    "year": startOfYear,
    "month": startOfMonth,
    "day": startOfDay,
    "hour": startOfHour,
    "minute": startOfMinute,
    "second": startOfSecond,
}


export const END_OF_UNIT_FUNCTIONS: Record<TimeUnit, (date: Date) => Date> = {
    "year": endOfYear,
    "month": endOfMonth,
    "day": endOfDay,
    "hour": endOfHour,
    "minute": endOfMinute,
    "second": endOfSecond,
}


export function parseNaturalLanguageDateString(text: string): ParseNaturalLanguageDateStringResult {
    const [parsedResult] = chrono.parse(text, new Date(), { forwardDate: true });
    if (!parsedResult) return null;

    const matchedText = parsedResult.text
    const start = parsedResult.start.date()
    const end = parsedResult.end?.date()
    const smallestCertainUnit = getSmallestCertainUnit(parsedResult.start);

    return {
        start,
        end,
        smallestCertainUnit,
        matchedText
    }
}

function getSmallestCertainUnit(parsedComponents: chrono.ParsedComponents): TimeUnit {
    const areCertainsValues = TIME_UNITS.map(timeUnit => {
        const isCertain = parsedComponents.isCertain(timeUnit)
        const hasValue = parsedComponents.get(timeUnit) !== null
        return isCertain && hasValue
    })

    const firstUncertainUnitIndex = areCertainsValues.findIndex(value => value === false)
    return TIME_UNITS[firstUncertainUnitIndex - 1]
}

export function startOf(date: Date, unit: TimeUnit): Date {
    const timeUnitsBefore = getTimeUnitsAfter(unit)
    let updatedDate = date;
    timeUnitsBefore.forEach(timeUnit => {
        updatedDate = START_OF_UNIT_FUNCTIONS[timeUnit](updatedDate)
    })
    return updatedDate;
}

export function endOf(date: Date, unit: TimeUnit): Date {
    const timeUnitsBefore = getTimeUnitsAfter(unit)
    let updatedDate = date;
    timeUnitsBefore.forEach(timeUnit => {
        updatedDate = END_OF_UNIT_FUNCTIONS[timeUnit](updatedDate)
    })
    return updatedDate;
}

function getTimeUnitsAfter(unit: TimeUnit): TimeUnit[] {
    return TIME_UNITS.slice(TIME_UNITS.indexOf(unit))
}