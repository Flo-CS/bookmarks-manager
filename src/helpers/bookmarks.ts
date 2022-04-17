import { groupBy, toPairs } from "lodash";
import { v4 as uuidv4 } from 'uuid';

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

// TODO: Change this interfaces names and find a proper way to use them
export type BookmarkForModal = BookmarkUserComplement & Partial<BookmarkPictures>;
export type BookmarkForDatabase = BookmarkMinimal & BookmarkUserComplement
export type CompleteBookmark = BookmarkUserComplement & BookmarkMinimal & BookmarkDates & Partial<BookmarkPictures> & Partial<BookmarkHistory>

// TODO: Move that to a separate file
export function getKeySeparatedBookmarks<B>(bookmarks: B[], groupFunc: (b: B) => any) {
    return toPairs(
        groupBy(bookmarks, groupFunc)
    )
}

export function createDefaultBookmark(): CompleteBookmark {
    return {
        linkTitle: "",
        url: "",
        tags: [],
        description: "",
        creationDate: new Date(),
        modificationDate: new Date(),
        collection: "",
        variant: "preview",
        id: uuidv4()
    }
}