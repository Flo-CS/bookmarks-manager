import { groupBy, toPairs } from "lodash";

export interface BookmarkUserComplement {
    linkTitle: string,
    url: string,
    tags: string[],
    description: string,
}

// TODO : Replace linkTitle by bookmarkTitle

export interface BookmarkMinimal {
    id: string,
    url: string,
    collection: string,
    variant: "icon" | "preview",
}

export interface BookmarkDates {
    creationDate: Date,
    modificationDate: Date,
}
export interface BookmarkHistory {
    openHistory: Date[],
    copyHistory: Date[],
}
export interface BookmarkPictures {
    faviconPath: string,
    previewPath: string
}

export interface BookmarkMetadata {
    siteName: string
}

// TODO: Replace siteName by linkTitle

export type BookmarkForModal = BookmarkUserComplement & Partial<BookmarkPictures>;

export function getKeySeparatedBookmarks<B>(bookmarks: B[], groupFunc: (b: B) => any) {
    return toPairs(
        groupBy(bookmarks, groupFunc)
    )
}