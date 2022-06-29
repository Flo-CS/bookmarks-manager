import {ipcMain} from "electron";
import {Bookmark, Collection, Website} from "./models";
import {APIRequestMessage} from "../src/helpers/api";
import {fetchWebsiteMetadata} from "./websiteDataFetcher";
import {reorderCollections} from "../src/helpers/collections";


type BridgeHandler<T extends keyof APIRequestMessage> = (event: Electron.IpcMainInvokeEvent, ...params: APIRequestMessage[T]["params"]) => Promise<APIRequestMessage[T]["result"]>
type BridgeHandlers = {
    [T in keyof APIRequestMessage]?: BridgeHandler<T>;
};

export async function registerBridgeHandlers() {

    const handlers: BridgeHandlers = {
        "getBookmarks": async () => {
            const bookmarks = await Bookmark.findAll();
            return bookmarks.map(bookmark => bookmark.get())
        },
        "addBookmark": async (event, bookmarkData) => {
            const bookmark = await Bookmark.create({
                ...bookmarkData
            }, {})
            return bookmark.get();
        },
        "updateBookmark": async (event, id, bookmarkData) => {
            await Bookmark.update({
                ...bookmarkData
            }, {
                where: {id: id}
            })

            const updatedBookmark = await Bookmark.findByPk(id);
            return updatedBookmark?.get();
        },
        "removeBookmark": async (event, id) => {
            await Bookmark.destroy({
                where: {id: id}
            })
        },
        "getCollections": async () => {
            const collections = await Collection.findAll()
            return collections.map(collection => collection.get())
        },
        "addCollection": async (event, collectionData) => {
            const collection = await Collection.create({...collectionData})
            return collection.get()
        },
        "updateCollection": async (event, id, collectionData) => {
            await Collection.update({
                ...collectionData
            }, {
                where: {id: id}
            })

            const updatedCollection = await Collection.findByPk(id);
            return updatedCollection?.get();
        },
        "reorderCollections": async (event, id, newParentId, newIndex) => {
            const collectionToMove = await Collection.findByPk(id)
            if (!collectionToMove) return []

            collectionToMove.update({parent: newParentId})

            const collections = (await Collection.findAll({
                where: {
                    parent: newParentId
                }
            })).map(collection => collection.get())

            const collectionsReorder = reorderCollections(collections, {
                id: id,
                index: collectionToMove.get("index") as number,
                parent: collectionToMove.get("parent") as string
            }, newIndex)

            for (const collection of collectionsReorder) {
                Collection.update({
                    index: collection.index
                }, {
                    where: {
                        id: collection.id
                    }
                })
            }

            return collectionsReorder
        },
        "removeCollection": async (event, id, removeAction) => {
            await Collection.destroy({
                where: {id: id}
            })
        },
        "fetchWebsiteData": async (event, URL: string, forceDataRefresh: boolean) => {
            if (forceDataRefresh) {
                Website.destroy({
                    where: {url: URL}
                })
            }
            const websiteMetadata = await fetchWebsiteMetadata(URL)
            const website = await Website.findOrCreate({
                where: {
                    url: URL
                },
                defaults: {
                    url: URL,
                    title: websiteMetadata.title,
                    description: websiteMetadata.description,
                    faviconPicture: websiteMetadata.pictures.favicon,
                    previewPicture: websiteMetadata.pictures.preview,
                }
            })

            const websiteData = website[0].get()

            return {
                URL: websiteData.url,
                metadata: websiteData.metadata,
            }
        }
    }

    for (const [channel, handler] of Object.entries(handlers)) {
        ipcMain.handle(channel, handler)
    }

}
