import path from "path";
import {app} from "electron"
import {PicturesVariant, WebsitePicture} from "../types/website";

export const ARRAY_SEPARATOR = ";";
export const PICTURES_PATH = path.join(app.getPath("userData"), "pictures")

export const DataPaths = {
    favicon: path.join(PICTURES_PATH, "favicon"),
    preview: path.join(PICTURES_PATH, "preview"),
    screenshot: path.join(PICTURES_PATH, "screenshot")
}

export function getDataFilePath(type: keyof typeof DataPaths, fileId: string, fileExtension: string): string {
    return path.join(DataPaths[type], fileId + fileExtension)
}

export function getWebsitePicture(type: PicturesVariant, pictureURL: string, websiteId: string): WebsitePicture {
    return {url: pictureURL, localPath: getDataFilePath(type, websiteId, path.extname(pictureURL))}
}