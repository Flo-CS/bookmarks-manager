import { AddBookmarkData, BookmarkData, UpdateBookmarkData } from "./bookmarks";
import { AddCollectionData, CollectionData, MoveCollectionData, UpdateCollectionData } from "./collections";
import { WebsiteData } from "./website";
import { WithId, WithIndex } from "./helpersTypes";

export type ApiRequests = {
    removeBookmark: { params: [string], result: true }
    addBookmark: { params: [AddBookmarkData], result: BookmarkData },
    getBookmarks: { params: [], result: BookmarkData[] }
    updateBookmark: { params: [string, UpdateBookmarkData], result: BookmarkData },
    getCollections: { params: [], result: CollectionData[] },
    addCollection: { params: [AddCollectionData], result: [CollectionData, (WithId & WithIndex)[]] },
    updateCollection: { params: [string, UpdateCollectionData], result: CollectionData };
    moveCollection: { params: [MoveCollectionData], result: CollectionData[] }
    removeCollection: { params: [string], result: (WithId & WithIndex)[] },
    getWebsite: { params: [string, boolean], result: WebsiteData }
}

export interface ApiErrorResult {
    error: {
        message: string
    }
}

export type ApiRequestsWithError = {
    [T in keyof ApiRequests]: {
        params: ApiRequests[T]["params"],
        result: ApiRequests[T]["result"] | ApiErrorResult
    }
}

export type ApiRequestSender<T extends keyof ApiRequests> = (...params: ApiRequests[T]["params"]) => Promise<ApiRequests[T]["result"]>
export type ApiRequestHandler<T extends keyof ApiRequests> = (...params: ApiRequests[T]["params"]) => Promise<ApiRequests[T]["result"]>

export type Api = {
    [T in keyof ApiRequests]: ApiRequestSender<T>
}
export type ApiRequestsHandlers = {
    [T in keyof ApiRequests]: ApiRequestHandler<T>
}

