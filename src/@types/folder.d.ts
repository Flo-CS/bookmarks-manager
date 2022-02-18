import React from "react";

export interface FolderData {
    key: string,
    name: string,
    iconPath?:string,
    icon?: React.ComponentType,
    children?: FolderData[],
    parent?: FolderData,
    isFolded?: boolean,
    count?: number
}