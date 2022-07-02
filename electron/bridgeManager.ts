import {ipcMain} from "electron";
import {Bookmark, Collection, Website} from "./models";
import {APIRequestMessages} from "../src/helpers/api";
import {fetchWebsiteMetadata} from "./websiteDataFetcher";
import {reorderCollectionsWithMovement} from "../src/helpers/collections";
import {Op} from "sequelize";


type BridgeHandler<T extends keyof APIRequestMessages> = (event: Electron.IpcMainInvokeEvent, ...params: APIRequestMessages[T]["params"]) => Promise<APIRequestMessages[T]["result"]>
type BridgeHandlers = {
    [T in keyof APIRequestMessages]?: BridgeHandler<T>;
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
        "reorderCollections": async (event, movingCollectionId, newParentId, newMovingCollectionIndex) => {
            const movingCollection = await Collection.findByPk(movingCollectionId)
            if (!movingCollection) return []

            await movingCollection.update({parent: newParentId})

            const siblingCollections = await Collection.findAll({
                where: {
                    [Op.and]: [
                        {parent: newParentId},
                        {
                            [Op.not]: {
                                id: movingCollectionId
                            }
                        }
                    ]
                }
            })

            siblingCollections.push(movingCollection)

            const collections = siblingCollections.map(collection => collection.get())
            const movingCollectionIndex = collections.length - 1

            const collectionsReorder = reorderCollectionsWithMovement(collections, movingCollectionIndex, newMovingCollectionIndex)

            for (const reorderedCollection of collectionsReorder) {
                Collection.update({
                    index: reorderedCollection.index,
                }, {
                    where: {
                        id: reorderedCollection.id
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
