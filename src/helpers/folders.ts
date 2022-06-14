import React from "react";

export enum SpecialFolders {
    ALL = "%ALL%",
    TRASH = "%TRASH%",
    WITHOUT_FOLDER = "%WITHOUT_FOLDER%",
}

// TODO: Rename this to BookmarkCollection
export interface FolderData {
    key: string,
    name: string,
    iconPath?: string,
    icon?: React.ComponentType,
    children?: FolderData[],
    parent?: FolderData,
    isFolded?: boolean,
    count?: number
}