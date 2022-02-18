import {Folder} from "../@types/folder";
import React from "react";
import FolderTreeItem from "./FolderTreeItem";

type Props = {
    folders?: Folder[],
    children?: React.ReactNode,
    selectedFolderId?: string,
    onFolderClick?: (folderId: string) => void
}

export default function FoldersTree({folders, children, selectedFolderId, onFolderClick}: Props) {

    function handleFolderClick(folderId: string) {
        onFolderClick && onFolderClick(folderId)
    }

    function foldersToComponent(folders: Folder[]) {
        return folders.map((folder) => {
            const commonProps = {
                key: folder.id,
                folderId: folder.id,
                name: folder.name,
                icon: folder.icon,
                count: folder.count,
                isDefaultFolded: folder.isDefaultFolded,
                onClick: handleFolderClick,
                isSelected: folder.id === selectedFolderId,
            }
            if (folder.children) {
                return <FolderTreeItem {...commonProps}>
                    {foldersToComponent(folder.children)}
                </FolderTreeItem>
            }
            return <FolderTreeItem {...commonProps}/>
        })

    }

    return <section>
        {children || folders && foldersToComponent(folders)}
    </section>
}