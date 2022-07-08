export type Copy<T> = { [K in keyof T]: T[K] }

export type NullPartial<T> = {
    [P in keyof T]?: Nullable<T[P]>
}

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type NullOptional<T, K extends keyof T> = Omit<T, K> &
    NullPartial<Pick<T, K>>

export type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>
export type NullAtLeast<T, K extends keyof T> = NullPartial<T> & Pick<T, K>

export type AtMost<T, K extends keyof T> = Optional<Required<T>, K>
export type NullAtMost<T, K extends keyof T> = NullOptional<Required<T>, K>

export type Nullable<T> = T | null

export interface WithId {
    id: string
}

export interface WithIndex {
    index: number
}

type Primitive = string | number | symbol

export type GenericObject = Record<Primitive, unknown>

/**
 * Credit to: https://javascript.plainenglish.io/advanced-typescript-type-level-nested-object-paths-7f3d8901f29a
 */

type Join<L extends Primitive | undefined, R extends Primitive | undefined> =
    L extends string | number ?
    R extends string | number ?
    `${L}.${R}`
    : L
    : R extends string | number
    ? R
    : undefined

type Union<
    L extends unknown | undefined,
    R extends unknown | undefined
    > = L extends undefined
    ? R extends undefined
    ? undefined
    : R
    : R extends undefined
    ? L
    : L | R

/**
 * NestedPaths
 * Get all the possible paths of an object
 * @example
 * type Keys = NestedPaths<{ a: { b: { c: string } }>
 * // 'a' | 'a.b' | 'a.b.c'
 */
export type NestedPaths<
    T extends GenericObject,
    Prev extends Primitive | undefined = undefined,
    Path extends Primitive | undefined = undefined
    > = {
        [K in keyof T]: T[K] extends GenericObject
        ? NestedPaths<T[K], Union<Prev, Path>, Join<Path, K>>
        : Union<Union<Prev, Path>, Join<Path, K>>
    }[keyof T]
