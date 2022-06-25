import {app} from "electron"
import path from "path"
import {PicturesVariant, WebsitePicture} from "../src/helpers/websiteMetadata"


export const picturesPath = path.join(app.getPath("userData"), "pictures")

export type DataPaths = { [T in PicturesVariant]: string }

export const dataPaths: DataPaths = {
    favicon: path.join(picturesPath, "favicon"),
    preview: path.join(picturesPath, "preview"),
    screenshot: path.join(picturesPath, "screenshot")
}

export function getDataFilePath<T extends keyof DataPaths>(type: T, fileId: string, fileExtension: string) {
    return path.join(dataPaths[type], fileId + fileExtension)
}

export function getWebsitePicture(type: PicturesVariant, pictureURL: string, websiteId: string): WebsitePicture {
    return [pictureURL, getDataFilePath(type, websiteId, path.extname(pictureURL))]
}