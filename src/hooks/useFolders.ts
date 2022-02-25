import {FolderData} from "../@types/folder";
import Tree from "../helpers/tree";
import {useMemo, useState} from "react";

export default function useFolders(initFolders: FolderData[], rootKey: string) {
    const [foldersTree, setFoldersTree] = useState<Tree<string>>(new Tree({
        key: rootKey,
        children: initFolders
    }));

    function insertFolder(parentFolderKey: string, folder: FolderData, index?: number) {
        setFoldersTree((folders) => {
            const foldersTree = new Tree(folders.root).insert(parentFolderKey, folder, index)
            return foldersTree || folders
        })
    }

    function removeFolder(folderKey: string) {
        setFoldersTree((folders) => {
            const foldersTree = new Tree(folders.root).remove(folderKey)
            return foldersTree || folders
        })
    }

    function moveFolder(folderKey: string, destinationFolderKey: string, index?: number) {
        setFoldersTree((folders) => {
            const foldersTree = new Tree(folders.root).move(folderKey, destinationFolderKey, index)
            return foldersTree || folders
        })
    }

    const foldersRoot = useMemo(() => foldersTree.root, [foldersTree]) as FolderData;
    return {
        foldersRoot, insertFolder, removeFolder, moveFolder
    }


}