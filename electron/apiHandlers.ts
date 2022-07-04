import {Bookmark, Collection, Website} from "./models";
import {ApiErrors} from "../utils/apiErrors";
import {reorderCollectionsWithMovement} from "../utils/collections";
import {fetchWebsiteMetadata} from "./websiteDataFetcher";
import {Op} from "sequelize";
import {ApiRequestsHandlers} from "../types/api";


export const ApiHandlers: ApiRequestsHandlers = {
    async getBookmarks() {
        const bookmarks = await Bookmark.findAll();
        return bookmarks.map(bookmark => bookmark.get())
    },
    async addBookmark({
                          url,
                          description,
                          tags,
                          siteName,
                          linkTitle,
                          collection,
                          variant,
                          previewPath,
                          faviconPath
                      }) {
        const bookmark = await Bookmark.create({
            url,
            description,
            tags,
            siteName,
            linkTitle,
            collection,
            variant,
            previewPath,
            faviconPath,
        }, {})
        return bookmark.get();
    },
    async updateBookmark(id, {
        url,
        tags,
        siteName,
        linkTitle,
        collection,
        variant,
        description,
        faviconPath,
        previewPath,
        copyHistory,
        openHistory
    }) {
        await Bookmark.update({
            url,
            tags,
            siteName,
            linkTitle,
            collection,
            variant,
            description,
            faviconPath,
            previewPath,
            copyHistory,
            openHistory
        }, {
            where: {id: id}
        })

        const updatedBookmark = await Bookmark.findByPk(id);
        if (!updatedBookmark) throw new Error(ApiErrors.BOOKMARK_NOT_FOUND)

        return updatedBookmark?.get();
    },
    async removeBookmark(id) {
        await Bookmark.destroy({
            where: {id: id}
        })
        return true
    },
    async getCollections() {
        const collections = await Collection.findAll()
        return collections.map(collection => collection.get())
    },
    async addCollection({parent, name, isFolded, iconPath, index}) {
        const collection = await Collection.create({parent, name, isFolded, iconPath, index})
        return collection.get()
    },
    async updateCollection(id, {parent, name, isFolded, iconPath}) {
        await Collection.update({
            parent,
            name,
            isFolded,
            iconPath
        }, {
            where: {id: id}
        })

        const updatedCollection = await Collection.findByPk(id);
        if (!updatedCollection) throw new Error(ApiErrors.COLLECTION_NOT_FOUND)

        return updatedCollection?.get();
    },
    async reorderCollections({movingCollectionId, newParent, newIndex}) {
        const movingCollection = await Collection.findByPk(movingCollectionId)
        if (!movingCollection) return []

        await movingCollection.update({parent: newParent})

        const siblingCollections = await Collection.findAll({
            where: {
                [Op.and]: [
                    {parent: newParent},
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

        const collectionsReorder = reorderCollectionsWithMovement(collections, movingCollectionIndex, newIndex)

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
        return true
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