import {FetchedWebsiteMetadata} from "../src/helpers/websiteMetadata"
import {unfurl} from 'unfurl.js'


export async function fetchWebsiteMetadata(URL: string): Promise<FetchedWebsiteMetadata> {
    const result = await unfurl(URL)
    return {
        title: result.title,
        description: result.description,
        pictures: {
            preview: result.open_graph?.images?.[0].url,
            favicon: result.favicon
        },
    }
}