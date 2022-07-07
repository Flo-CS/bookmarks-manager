import { AtLeast, Nullable, WithId, WithIndex, } from "./helpersTypes";
import { TopCollections, VirtualCollections } from "../utils/collections";
import React from "react";

// DATABASE
export interface CollectionAttributes {
    id: string
    parent: string
    name: string
    isFolded: boolean
    iconPath: Nullable<string>
    index: number

    creationDate: Date
    modificationDate: Date
}

export type CollectionCreationAttributes = AtLeast<CollectionAttributes, "name" | "index">

export type SpecialCollection = VirtualCollections | TopCollections

// API
export type CollectionData = CollectionAttributes

export type MovedCollectionData = WithId & WithIndex

export interface CollectionDataExtended extends Omit<CollectionData, "parent"> {
    icon?: React.ComponentType,
    parent?: string
}

export interface AddCollectionData {
    parent?: string
    name: string
    isFolded?: boolean
    iconPath?: Nullable<string>
    index: number
}

export interface UpdateCollectionData {
    name?: string
    isFolded?: boolean
    iconPath?: Nullable<string>
}

export interface MoveCollectionData {
    movingCollectionId: string,
    newParent: string,
    newIndex?: number
}