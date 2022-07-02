import {Bookmark, Collection, Website} from "./models";
import {ApiErrors} from "../src/helpers/api/ApiErrors";
import {reorderCollectionsWithMovement} from "../src/helpers/collections";
import {fetchWebsiteMetadata} from "./websiteDataFetcher";
import {Op} from "sequelize";
import {ApiRequestsHandlers} from "../src/helpers/api/Api";


export const ApiHandlers: ApiRequestsHandlers = {
    async getBookmarks() {
        const bookmarks = await Bookmark.findAll();
        return bookmarks.map(bookmark => bookmark.get())
    },
    async addBookmark(bookmarkData) {
        const bookmark = await Bookmark.create({
            ...bookmarkData
        }, {})
        return bookmark.get();
    },
    async updateBookmark(id, bookmarkData) {
        await Bookmark.update({
            ...bookmarkData
        }, {
            where: {id: id}
        })

        const updatedBookmark = await Bookmark.findByPk(id);
        return updatedBookmark?.get();
    },
    async removeBookmark(id) {
        await Bookmark.destroy({
            where: {id: id}
        })
    },
    async getCollections() {
        const collections = await Collection.findAll()
        return collections.map(collection => collection.get())
    },
    async addCollection(collectionData) {
        const collection = await Collection.create({...collectionData})
        return collection.get()
    },
    async updateCollection(id, collectionData) {
        await Collection.update({
            ...collectionData
        }, {
            where: {id: id}
        })

        const updatedCollection = await Collection.findByPk(id);
        if (!updatedCollection) {
            throw new Error(ApiErrors.COLLECTION_NOT_FOUND)
        }
        return updatedCollection?.get();
    },
    async reorderCollections(movingCollectionId, newParentId, newMovingCollectionIndex) {
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
    async removeCollection(id, removeAction) {
        await Collection.destroy({
            where: {id: id}
        })
    },
    async fetchWebsiteData(URL: string, forceDataRefresh: boolean) {
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