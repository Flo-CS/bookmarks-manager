import {Folder} from "../@types/folder";
import React from "react";
import FolderTreeItem from "./FolderTreeItem";

type Props = {
    folders: Folder[],
    children?: React.ReactNode
}

export default function FoldersTree({folders, children}: Props) {

    function foldersToComponent(folders: Folder[]) {
        return folders.map((folder) => {
            if (folder.children) {
                return <FolderTreeItem key={folder.id} folderId={folder.id} name={folder.name}>
                    {foldersToComponent(folder.children)}
                </FolderTreeItem>
            }
            return <FolderTreeItem key={folder.id} folderId={folder.id} name={folder.name}/>
        })

    }

    return <section>
        {children || foldersToComponent(folders)}
    </section>
}