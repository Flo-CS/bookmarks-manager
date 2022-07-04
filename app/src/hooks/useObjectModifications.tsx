import {isEqual, mergeWith, pickBy} from "lodash";
import {useState} from "react";

export default function useObjectModifications<T extends Record<string, unknown>>(initialData: T) {
    const [obj, setObj] = useState<T>(initialData)

    function getObjModifications(): Partial<T> {
        return pickBy<T>(
            obj,
            (value, key) => !isEqual(value, initialData[key])
        )
    }

    function updateObjField(field: keyof T, value: unknown) {
        setObj((obj) => ({...obj, [field]: value}))
    }

    function updateObjFields(fields: Partial<T>, eraseIf: <K extends keyof T> (value: T[K], key: K) => boolean = () => true) {
        setObj((obj) => {
            return mergeWith({...obj}, fields, (currentValue, newValue, key) => {
                if (eraseIf(currentValue, key)) {
                    return newValue
                }
                return currentValue
            })
        })
    }


    return [obj, updateObjFields, updateObjField, getObjModifications] as const
}