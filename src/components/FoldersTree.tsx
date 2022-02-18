import {FolderData} from "../@types/folder";
import React from "react";
import FolderTreeItem, {FolderTreeItemProps} from "./FolderTreeItem";

type Props = {
    folders?: FolderData[],
    children?: React.ReactNode,
    selectedFolderId?: string,
    onFolderClick?: (folderId: string) => void
}

export default function FoldersTree({folders, children, selectedFolderId, onFolderClick}: Props) {

    function handleFolderClick(folderId: string) {
        onFolderClick && onFolderClick(folderId)
    }

    function foldersToComponent(folders: FolderData[]) {
        return folders.map((folder) => {
            const commonProps = {
                key: folder.key,
                folderId: folder.key,
                name: folder.name,
                icon: folder.icon,
                count: folder.count,
                isDefaultFolded: folder.isFolded,
                onClick: handleFolderClick,
                isSelected: folder.key === selectedFolderId,
            }
            if (folder.children) {
                return <FolderTreeItem {...commonProps}>
                    {foldersToComponent(folder.children)}
                </FolderTreeItem>
            }
            return <FolderTreeItem {...commonProps}/>
        })

    }

    // Add onClick handler and isSelected prop to children FolderTreeItem
    // TODO: Improve this ?
    const childrenWithSelectionHandlers = React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child, {
                ...child.props,
                onClick: handleFolderClick,
                isSelected: child.props.folderId === selectedFolderId,
            } as FolderTreeItemProps)
        }
    })

    return <section>
        {childrenWithSelectionHandlers || folders && foldersToComponent(folders)}
    </section>
}