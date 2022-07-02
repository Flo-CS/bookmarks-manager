import {BookmarkData, BookmarkMinimum} from "../bookmarks";
import {CollectionData, CollectionMinimum, CollectionRemoveAction, OrderedCollection} from "../collections";
import {WebsiteData} from "../websiteData";

export type ApiRequests = {
    "removeBookmark": { params: [string], result: void }
    "addBookmark": { params: [BookmarkMinimum | BookmarkData], result: BookmarkData },
    "getBookmarks": { params: [], result: BookmarkData[] }
    "updateBookmark": { params: [string, Partial<BookmarkData>], result: BookmarkData },
    "getCollections": { params: [], result: CollectionData[] },
    "addCollection": { params: [CollectionMinimum | CollectionData], result: CollectionData },
    "updateCollection": { params: [string, Partial<CollectionData>], result: CollectionData };
    "reorderCollections": { params: [string, string, number], result: OrderedCollection[] }
    "removeCollection": { params: [string, CollectionRemoveAction], result: void },
    "fetchWebsiteData": { params: [string, boolean], result: WebsiteData }
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

export type ApiRequestsSenders = {
    [T in keyof ApiRequests]: ApiRequestSender<T>
}
export type ApiRequestsHandlers = {
    [T in keyof ApiRequests]: ApiRequestHandler<T>
}

