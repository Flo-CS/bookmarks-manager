import React from "react";
import {v4 as uuidv4} from 'uuid';

export enum SpecialsCollections {
    ALL = "%ALL%",
    TRASH = "%TRASH%",
    WITHOUT_COLLECTION = "%WITHOUT_COLLECTION%",
    ROOT = "%ROOT%"
}

export interface BookmarksCollection extends Omit<CollectionData, "parent"> {
    icon?: React.ComponentType,
    children?: BookmarksCollection[],
    parent?: BookmarksCollection
}

export interface CollectionData {
    id: string,
    name: string,
    iconPath?: string,
    parent: string,
    isFolded?: boolean,
}

export function createDefaultCollection(name: string, selectedCollectionId: string): CollectionData {
    return {
        name: name,
        id: uuidv4(),
        parent: Object.values(SpecialsCollections).includes(selectedCollectionId as unknown as SpecialsCollections) ? SpecialsCollections.ROOT : selectedCollectionId,
    }
}