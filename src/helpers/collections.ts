import React from "react";

export enum SpecialsCollections {
    ALL = "%ALL%",
    TRASH = "%TRASH%",
    WITHOUT_COLLECTION = "%WITHOUT_COLLECTION%",
}

export interface BookmarksCollection {
    key: string,
    name: string,
    iconPath?: string,
    icon?: React.ComponentType,
    children?: BookmarksCollection[],
    parent?: BookmarksCollection,
    isFolded?: boolean,
    count?: number
}