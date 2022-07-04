export type Copy<T> = { [K in keyof T]: T[K] }

export type NullPartial<T> = {
    [P in keyof T]?: Nullable<T[P]>;
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type NullOptional<T, K extends keyof T> = Omit<T, K> & NullPartial<Pick<T, K>>;

export type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>
export type NullAtLeast<T, K extends keyof T> = NullPartial<T> & Pick<T, K>

export type AtMost<T, K extends keyof T> = Optional<Required<T>, K>
export type NullAtMost<T, K extends keyof T> = NullOptional<Required<T>, K>

export type Nullable<T> = T | null

export interface WithId {
    id: string
}