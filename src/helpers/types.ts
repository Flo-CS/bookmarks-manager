export type Copy<T> = { [K in keyof T]: T[K] }

export type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type AtMost<T, K extends keyof T> = Optional<Required<T>, K>

export type Id = string