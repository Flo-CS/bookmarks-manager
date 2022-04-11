export interface BookmarkUserComplement {
    linkTitle: string,
    url: string,
    tags: string[],
    description: string,
}

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