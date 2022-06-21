import {groupBy, toPairs} from "lodash";
import {v4 as uuidv4} from 'uuid';
import {SpecialsCollections} from "./collections";

export enum BookmarkVariant {
    PREVIEW = "preview",
    ICON = "icon"
}

export interface BookmarkData {
    tags: string[],
    description?: string,
    id: string,
    url: string,
    collection: string,
    variant: BookmarkVariant,
    creationDate: Date,
    modificationDate: Date,
    openHistory?: Date[],
    copyHistory?: Date[],
    siteName?: string,
    linkTitle?: string,
    faviconPath?: string,
    previewPath?: string
}

export interface Bookmark extends BookmarkData {

}


// TODO: Move that to a separate file
export function getKeySeparatedBookmarks<B>(bookmarks: B[], groupFunc: (b: B) => unknown) {
    return toPairs(
        groupBy(bookmarks, groupFunc)
    )
}

export function createDefaultBookmark(selectedCollectionId: string): Omit<BookmarkData, "creationDate" | "modificationDate"> {
    return {
        linkTitle: "",
        url: "",
        tags: [],
        description: "",
        collection: Object.values(SpecialsCollections).includes(selectedCollectionId as unknown as SpecialsCollections) ? SpecialsCollections.WITHOUT_COLLECTION : selectedCollectionId,
        variant: BookmarkVariant.PREVIEW,
        id: uuidv4()
    }
}