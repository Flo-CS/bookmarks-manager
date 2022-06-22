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

export interface CollectionDataExtended extends CollectionData {
    icon?: React.ComponentType,

}

export interface TreeOutputCollection extends Omit<CollectionDataExtended, "parent"> {
    children?: TreeOutputCollection[],
    count?: number
}

export interface TreeInputCollection extends Omit<CollectionDataExtended, "parent"> {
    parent?: string
}

export interface TreeCollectionItem {
    collection: string
}

export function createDefaultCollection(name: string, selectedCollectionId: string) {
    return {
        name: name,
        id: uuidv4(),
        parent: Object.values(SpecialsCollections).includes(selectedCollectionId as unknown as SpecialsCollections) ? SpecialsCollections.MAIN : selectedCollectionId,
        isFolded: false
    }
}