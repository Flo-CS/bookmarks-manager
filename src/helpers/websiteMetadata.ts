export type PicturesVariant = "favicon" | "screenshot" | "preview"
export type WebsitesVariant = "page" | "site"

export type WebsitePicture = [string, string]
export type WebsiteMetadata = {
    title?: string
    description?: string
    pictures: Partial<{
        [_ in PicturesVariant]: WebsitePicture
    }>
}