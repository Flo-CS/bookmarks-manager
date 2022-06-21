import React from "react";
import {v4 as uuidv4} from 'uuid';

export enum SpecialsCollections {
    ALL = "%ALL%",
    TRASH = "%TRASH%",
    WITHOUT_COLLECTION = "%WITHOUT_COLLECTION%",
    MAIN = "%MAIN%"
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

export interface CollectionDataExtended extends Omit<CollectionData, "parent"> {
    icon?: React.ComponentType,
    parent?: string
}

export interface Collection extends Omit<CollectionDataExtended, "parent"> {
    parent?: Collection
    children?: Collection[]
}

export function createDefaultCollection(name: string, selectedCollectionId: string) {
    return {
        name: name,
        id: uuidv4(),
        parent: Object.values(SpecialsCollections).includes(selectedCollectionId as unknown as SpecialsCollections) ? SpecialsCollections.MAIN : selectedCollectionId,
        isFolded: false
    }
}