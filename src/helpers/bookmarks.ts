export interface BookmarkData {
    id: string,
    siteName?: string,
    linkTitle?: string,
    url: string,
    tags?: string[],
    creationDate: Date,
    modificationDate?: Date,
    collection: string,
    description?: string,
    variant: "icon" | "preview",
    openHistory?: Date[],
    copyHistory?: Date[],
    faviconPath?: string,
    previewPath?: string
}
