import {WebsiteMetadata, WebsitesVariant} from "./websiteMetadata";

export interface BookmarkWebsiteData {
    pageURL: string
    websiteURL: string
    metadata: { [_ in WebsitesVariant]: WebsiteMetadata }
}