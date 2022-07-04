import {AtLeast, Nullable} from "./helpersTypes";
import {BookmarkVariant} from "../utils/bookmarks";

// DATABASE
export interface BookmarkAttributes {
    id: string
    url: string
    collection: string
    variant: BookmarkVariant
    tags: Nullable<string[]>,
    description: Nullable<string>
    linkTitle: Nullable<string>
    faviconPath: Nullable<string>
    previewPath: Nullable<string>
    siteName: Nullable<string>
    openHistory: Nullable<Date[]>
    copyHistory: Nullable<Date[]>

    creationDate: Date
    modificationDate: Date
}

export type BookmarkCreationAttributes = AtLeast<BookmarkAttributes, "url">

export interface InternalBookmarkAttributes extends Omit<BookmarkAttributes, "tags" | "openHistory" | "copyHistory"> {
    tags: Nullable<string>,
    openHistory: Nullable<string>
    copyHistory: Nullable<string>
}

// API
export type BookmarkData = BookmarkAttributes

export interface AddBookmarkData {
    url: string
    collection?: string
    variant?: BookmarkVariant
    tags?: Nullable<string[]>
    description?: Nullable<string>
    linkTitle?: Nullable<string>
    faviconPath?: Nullable<string>
    previewPath?: Nullable<string>
    siteName?: Nullable<string>
}

export interface UpdateBookmarkData {
    url?: string
    collection?: string
    variant?: BookmarkVariant
    tags?: Nullable<string[]>
    description?: Nullable<string>
    linkTitle?: Nullable<string>
    faviconPath?: Nullable<string>
    previewPath?: Nullable<string>
    siteName?: Nullable<string>
    openHistory?: Nullable<Date[]>
    copyHistory?: Nullable<Date[]>
}

// LAYOUT
export interface LayoutBookmarkData {
    id: string,
    url: string
    variant: BookmarkVariant,
    modificationDate: Date,
    linkTitle?: Nullable<string>,
    faviconPath?: Nullable<string>,
    previewPath?: Nullable<string>,
    description?: Nullable<string>,
    tags?: Nullable<string[]>,
}