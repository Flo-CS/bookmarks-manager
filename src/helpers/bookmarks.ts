import {groupBy, toPairs} from "lodash";
import {getParentCollectionId, TreeOutputCollection} from "./collections";
import {v4 as uuidv4} from 'uuid';


export enum BookmarkVariant {
    PREVIEW = "preview",
    ICON = "icon"
}

export interface BookmarkMinimum {
    id: string,
    url: string,
    collection: string,
    variant: BookmarkVariant,
}

export interface BookmarkData extends BookmarkMinimum {
    tags: string[],
    creationDate: Date,
    modificationDate: Date,
    openHistory: Date[],
    copyHistory: Date[],
    description?: string,
    siteName?: string,
    linkTitle?: string,
    faviconPath?: string,
    previewPath?: string
}


// TODO: Move that to a separate file
export function getKeySeparatedBookmarks<B>(bookmarks: B[], groupFunc: (b: B) => unknown) {
    return toPairs(
        groupBy(bookmarks, groupFunc)
    )
}

export function createDefaultBookmark(selectedCollectionPath: TreeOutputCollection[]): BookmarkMinimum {
    return {
        url: "https://",
        collection: getParentCollectionId(selectedCollectionPath),
        variant: BookmarkVariant.PREVIEW,
        id: uuidv4()
    }
}