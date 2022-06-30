import {last, orderBy} from "lodash";
import React from "react";
import {v4 as uuidv4} from 'uuid';
import {arrayMoveImmutable} from "array-move"
import {Id} from "./types";

export const COLLECTIONS_SEPARATOR = "/"

export enum TopCollections {
    TRASH = "%TRASH%",
    MAIN = "%MAIN%"
}

export enum VirtualCollections {
    ALL = "%ALL%",
    WITHOUT_COLLECTION = "%WITHOUT_COLLECTION%"
}

export type SpecialCollection = VirtualCollections | TopCollections

export interface CollectionMinimum {
    id: Id,
    name: string,
    parent: Id,
    index: number
}

export interface CollectionData extends CollectionMinimum {
    iconPath?: string,
    isFolded?: boolean,
}

export interface CollectionDataExtended extends CollectionData {
    icon?: React.ComponentType,

}

export interface TreeOutputCollection extends Omit<CollectionDataExtended, "parent"> {
    children?: TreeOutputCollection[],
    parent?: TreeOutputCollection
    count?: number
}

export interface TreeInputCollection extends Omit<CollectionDataExtended, "parent"> {
    parent?: Id
}

export interface TreeCollectionItem {
    collection: Id
}

export interface OrderedCollection {
    id: Id,
    index: number,
    parent: Id
}

export type CollectionRemoveAction = "removeChildren" | "moveChildren"

export function getUserCreatedDeepestCollection<T extends TreeOutputCollection>(collectionPath: T[]): T | undefined {
    if (!isInSpecialCollection(collectionPath, TopCollections.MAIN)) {
        return undefined
    }
    return last(collectionPath)
}

export function isInSpecialCollection<T extends TreeOutputCollection>(collectionPath: T[], specialCollection: SpecialCollection): boolean {
    const topCollectionId = collectionPath[0]?.id

    return topCollectionId === specialCollection
}

export function getNewCollectionParentId(selectedCollectionPath: TreeOutputCollection[]): Id {
    return getUserCreatedDeepestCollection(selectedCollectionPath)?.id || TopCollections.MAIN
}

export function createDefaultCollection(name: string, parent: Id, index: number) {
    return {
        name: name,
        id: uuidv4(),
        parent: parent,
        index: index
    }
}

export function reorderCollectionsWithMovement<T extends OrderedCollection>(collections: T[], currentIndex: number, newIndex: number): T[] {
    const indexOrderedCollections = orderBy(collections, "index");
    return arrayMoveImmutable(indexOrderedCollections, currentIndex, newIndex).map((collection, index) => {
        return {
            ...collection,
            index: index,
        }
    })
}