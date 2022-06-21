import {groupBy, toPairs} from "lodash";
import {v4 as uuidv4} from 'uuid';
import {SpecialsCollections} from "./collections";

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

export interface ModalBookmark extends BookmarkMinimum {
    tags?: string[],
    description?: string,
}


// TODO: Move that to a separate file
export function getKeySeparatedBookmarks<B>(bookmarks: B[], groupFunc: (b: B) => unknown) {
    return toPairs(
        groupBy(bookmarks, groupFunc)
    )
}

export function createDefaultBookmark(selectedCollectionId: string) {
    return {
        url: "",
        collection: Object.values(SpecialsCollections).includes(selectedCollectionId as unknown as SpecialsCollections) ? SpecialsCollections.WITHOUT_COLLECTION : selectedCollectionId,
        variant: BookmarkVariant.PREVIEW,
        id: uuidv4()
    }
}