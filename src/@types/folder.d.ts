import React from "react";

export interface Folder {
    id: string,
    name: string,
    icon?: React.ComponentType,
    children?: Folder[],
    isDefaultFolded?: boolean,
    count?: number
}