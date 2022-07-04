import {groupBy, toPairs} from "lodash";
import {getUserCreatedDeepestCollection, TopCollections} from "./collections";
import {WithId} from "../types/helpersTypes";

export enum BookmarkVariant {
    PREVIEW = "preview",
    ICON = "icon"
}

export function getKeySeparatedBookmarks<B>(bookmarks: B[], groupFunc: (b: B) => unknown) {
    return toPairs(
        groupBy(bookmarks, groupFunc)
    )
}

export function createDefaultBookmark(selectedCollectionPath: WithId[]) {
    return {
        url: "https://",
        collection: getUserCreatedDeepestCollection(selectedCollectionPath)?.id || TopCollections.MAIN,
    }
}