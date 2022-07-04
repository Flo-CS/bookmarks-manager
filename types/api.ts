import {AddBookmarkData, BookmarkData, UpdateBookmarkData} from "./bookmarks";
import {
    AddCollectionData,
    CollectionData,
    OrderedCollectionData,
    RemoveCollectionActionType,
    ReorderCollectionData,
    UpdateCollectionData
} from "./collections";
import {WebsiteData} from "./website";

export type ApiRequests = {
    removeBookmark: { params: [string], result: true }
    addBookmark: { params: [AddBookmarkData], result: BookmarkData },
    getBookmarks: { params: [], result: BookmarkData[] }
    updateBookmark: { params: [string, UpdateBookmarkData], result: BookmarkData },
    getCollections: { params: [], result: CollectionData[] },
    addCollection: { params: [AddCollectionData], result: CollectionData },
    updateCollection: { params: [string, UpdateCollectionData], result: CollectionData };
    reorderCollections: { params: [ReorderCollectionData], result: OrderedCollectionData[] }
    removeCollection: { params: [string, RemoveCollectionActionType], result: true },
    fetchWebsiteData: { params: [string, boolean], result: WebsiteData }
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

