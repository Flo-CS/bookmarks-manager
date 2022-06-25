export type PicturesVariant = "favicon" | "screenshot" | "preview"

export type WebsitePicture = [string | null, string | null]

export interface CommonWebsiteMetadata<T extends string | WebsitePicture> {
    title?: string
    description?: string
    pictures: Partial<{
        [_ in PicturesVariant]: T
    }>
}

export type FetchedWebsiteMetadata = CommonWebsiteMetadata<string>

export type WebsiteMetadata = CommonWebsiteMetadata<WebsitePicture>