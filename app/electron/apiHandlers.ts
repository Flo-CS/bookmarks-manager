import {Bookmark, Collection, Website} from "./models";
import {ApiErrors} from "../utils/apiErrors";
import {reorderItemsByIndex, reorderItemsWithIndexMovement} from "../utils/collections";
import {fetchWebsiteMetadata} from "./websiteDataFetcher";
import {ApiRequestsHandlers} from "../types/api";
import {CollectionAttributes} from "../types/collections";


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
        const collection = await Collection.create({parent, name, isFolded, iconPath, index: index})
        return [collection.get(), await reorderCollections(collection.get().parent)]
    },
    async updateCollection(id, {name, isFolded, iconPath}) {
        await Collection.update({
            name,
            isFolded,
            iconPath
        }, {
            where: {id: id}
        })

        const updatedCollection = await Collection.findByPk(id);
        if (!updatedCollection) throw new Error(ApiErrors.COLLECTION_NOT_FOUND)

        return updatedCollection.get();
    },
    async moveCollection({movingCollectionId, newParent, newIndex}) {
        const movingCollection = await Collection.findByPk(movingCollectionId)
        if (!movingCollection) throw new Error(ApiErrors.COLLECTION_NOT_FOUND)

        await movingCollection.update({parent: newParent})

        if (newIndex !== undefined) {
            return await reorderCollectionsWithIndexMovement(newParent, movingCollectionId, newIndex)
        }
        return await reorderCollections(newParent)
    },
    async removeCollection(id) {
        const collectionToRemove = await Collection.findByPk(id)
        if (!collectionToRemove) throw new Error(ApiErrors.COLLECTION_NOT_FOUND);

        const childrenCollectionsIds: string[] = []
        const childrenBookmarksIds: string[] = []

        let currentCollectionsIds = [id]
        while (currentCollectionsIds.length > 0) {
            const childrenCollections = await Collection.findAll({
                where: {parent: currentCollectionsIds},
                attributes: ["id"]
            })
            const childrenBookmarks = await Bookmark.findAll({
                where: {collection: currentCollectionsIds},
                attributes: ["id"]
            })
            currentCollectionsIds = childrenCollections.map(collection => collection.get().id)
            const currentBookmarksIds = childrenBookmarks.map(bookmark => bookmark.get().id)

            childrenCollectionsIds.push(...currentCollectionsIds)
            childrenBookmarksIds.push(...currentBookmarksIds)
        }

        await Collection.destroy({
            where: {id: [...childrenCollectionsIds, id]}
        })
        await Bookmark.destroy({
            where: {id: [...childrenBookmarksIds]}
        })

        return await reorderCollections(collectionToRemove.get().parent)
    },
    async getWebsite(URL: string, forceDataRefresh: boolean) {
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

async function getCollectionChildren(parentCollectionId: string): Promise<CollectionAttributes[]> {
    const childrenCollectionsModels = await Collection.findAll({where: {parent: parentCollectionId}})
    return childrenCollectionsModels.map(childCollection => childCollection.get())
}

async function reorderCollections(parentCollectionId: string): Promise<CollectionAttributes[]> {
    const childrenCollections = await getCollectionChildren(parentCollectionId)
    const reorderedCollections = reorderItemsByIndex(childrenCollections);
    return await applyCollectionsReorder(reorderedCollections)
}

async function reorderCollectionsWithIndexMovement(parentCollectionId: string, movingCollectionId: string, newIndex: number): Promise<CollectionAttributes[]> {
    const siblingCollections = await getCollectionChildren(parentCollectionId)
    const reorderedCollections = reorderItemsWithIndexMovement(siblingCollections, movingCollectionId, newIndex)
    return await applyCollectionsReorder(reorderedCollections)
}

async function applyCollectionsReorder(reorderedCollections: CollectionAttributes[]): Promise<CollectionAttributes[]> {
    Collection.bulkCreate(reorderedCollections, {updateOnDuplicate: ["index"]})
    return reorderedCollections
}