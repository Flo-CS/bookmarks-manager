import {AtLeast, Nullable} from "./helpersTypes";

// DATABASE
export interface WebsiteAttributes {
    id: string
    url: string
    title: Nullable<string>
    description: Nullable<string>
    metadata: WebsiteMetadata
    faviconPicture: Nullable<WebsitePicture>
    previewPicture: Nullable<WebsitePicture>

    creationDate: Date
    modificationDate: Date
}

export interface WebsiteCreationAttributes extends AtLeast<Omit<WebsiteAttributes, "faviconPicture" | "previewPicture">, "url"> {
    faviconPicture: Nullable<string>
    previewPicture: Nullable<string>
}

export interface InternalWebsiteAttributes extends Omit<WebsiteAttributes, "faviconPicture" | "previewPicture"> {
    faviconPicture: Nullable<string>
    previewPicture: Nullable<string>
}

export type PicturesVariant = "favicon" | "screenshot" | "preview"

export type WebsitePicture = { url: string, localPath: string }


export type FetchedWebsiteMetadata = {
    title?: string
    description?: string
    pictures: {
        [_ in PicturesVariant]?: string
    }
}
export type WebsiteMetadata = {
    title: Nullable<string>
    description: Nullable<string>
    pictures: {
        [_ in PicturesVariant]?: Nullable<WebsitePicture>
    }
}

export interface WebsiteData {
    URL: string
    metadata: WebsiteMetadata
}