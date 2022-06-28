import {last} from "lodash";
import React from "react";
import {v4 as uuidv4} from 'uuid';

export const COLLECTIONS_SEPARATOR = "/"
export const TopCollections = {
    TRASH: "%TRASH%",
    MAIN: "%MAIN%"
}

export const VirtualCollections = {
    ALL: "%ALL%",
    WITHOUT_COLLECTION: "%WITHOUT_COLLECTION%"
}

export interface CollectionMinimum {
    id: string,
    name: string,
    parent: string,
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
    parent?: string
}

export interface TreeCollectionItem {
    collection: string
}

export function getParentCollectionId(selectedCollectionPath: { id: string }[]): string {
    const topCollectionId = selectedCollectionPath[0].id
    if (selectedCollectionPath.length <= 0 || Object.values(VirtualCollections).includes(topCollectionId) || topCollectionId === TopCollections.TRASH) {
        return TopCollections.MAIN
    }
    return last(selectedCollectionPath)?.id || TopCollections.MAIN
}

export function createDefaultCollection(name: string, selectedCollectionPath: TreeOutputCollection[]) {
    return {
        name: name,
        id: uuidv4(),
        parent: getParentCollectionId(selectedCollectionPath),
        isFolded: false
    }
}