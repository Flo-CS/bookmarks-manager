export type PicturesVariant = "favicon" | "screenshot" | "preview"
export type WebsitesVariant = "page" | "site"

export interface WebsiteData {
    pageURL: string
    websiteURL: string
    metadata: {
        [_ in WebsitesVariant]: {
            title?: string
            description?: string
            pictures: Partial<{
                [_ in PicturesVariant]: [string, string]
            }>
        }
    }
}