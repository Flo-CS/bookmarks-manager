import {last, orderBy} from "lodash";
import {arrayMoveImmutable} from "array-move"
import {CollectionDataExtended, OrderedCollectionData, SpecialCollection,} from "../types/collections";
import {WithId} from "../types/helpersTypes";

export enum TopCollections {
    TRASH = "%TRASH%",
    MAIN = "%MAIN%"
}

export enum VirtualCollections {
    ALL = "%ALL%",
    WITHOUT_COLLECTION = "%WITHOUT_COLLECTION%"
}

export const COLLECTIONS_TREE_ROOTS: CollectionDataExtended[] = [{
    name: TopCollections.TRASH,
    id: TopCollections.TRASH,
    index: -1,
    isFolded: false,
    iconPath: null,
    creationDate: new Date(),
    modificationDate: new Date(),
}, {
    name: TopCollections.MAIN,
    id: TopCollections.MAIN,
    index: -1,
    isFolded: false,
    iconPath: null,
    creationDate: new Date(),
    modificationDate: new Date(),
}]

export const COLLECTIONS_SEPARATOR = "/"

export function getUserCreatedDeepestCollection<T extends WithId>(collectionPath: T[]): T | undefined {
    if (!isInSpecialCollection(collectionPath, TopCollections.MAIN)) {
        return undefined
    }
    return last(collectionPath)
}

export function isInSpecialCollection<T extends WithId>(collectionPath: T[], specialCollection: SpecialCollection): boolean {
    const topCollectionId = collectionPath[0]?.id

    return topCollectionId === specialCollection
}

export function getNewCollectionParentId(selectedCollectionPath: WithId[]): string {
    return getUserCreatedDeepestCollection(selectedCollectionPath)?.id || TopCollections.MAIN
}

export function createDefaultCollection(name: string, parent: string, index: number) {
    return {
        name: name,
        parent: parent,
        index: index
    }
}

export function reorderCollectionsWithMovement<T extends OrderedCollectionData>(collections: T[], currentIndex: number, newIndex: number): T[] {
    const indexOrderedCollections = orderBy(collections, "index");
    return arrayMoveImmutable(indexOrderedCollections, currentIndex, newIndex).map((collection, index) => {
        return {
            ...collection,
            index: index,
        }
    })
}