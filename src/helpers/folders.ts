import React from "react";

export enum SpecialFolders {
    ALL = "%ALL%",
    TRASH = "%TRASH%",
    WITHOUT_FOLDER = "%WITHOUT_FOLDER%",
}

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