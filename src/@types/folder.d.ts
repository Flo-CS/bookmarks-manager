import React from "react";

export type Folder = {
    id: string,
    name: string,
    icon?: React.ComponentType,
    children?: Folder[],
    isDefaultFolded?: boolean,
    count?: number
}