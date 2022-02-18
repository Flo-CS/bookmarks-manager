export enum SpecialFolders {
    ALL = "%ALL%",
    TRASH = "%TRASH%",
    WITHOUT_FOLDER = "%WITHOUT_FOLDER%",
}

export class FolderTreeNode<I, D> {
    subFolders: FolderTreeNode<I, D>[];
    id: I;
    data?: D;
    parent: FolderTreeNode<I, D> | null;

    constructor(id: I, data?: D) {
        this.subFolders = [];
        this.parent = null;
        this.id = id;
        this.data = data;
    }
}

export class FoldersTree<I, D> {
    rootFolder: FolderTreeNode<I, D>;

    constructor(folderId: I, folderData?: D) {
        this.rootFolder = new FolderTreeNode<I, D>(folderId, folderData)
    }

    *preOrderTraversal(folder = this.rootFolder): IterableIterator<FolderTreeNode<I, D>> {
        yield folder;
        if (folder.subFolders.length) {
            for (const subFolder of folder.subFolders) {
                yield* this.preOrderTraversal(subFolder);
            }
        }
    }

    insert(parentFolderId: I, folderId: I, folderData?: D) {
        if (this.find(folderId)) return null;

        for (const folder of this.preOrderTraversal()) {
            if (folder.id === parentFolderId) {
                const newFolder = new FolderTreeNode<I, D>(folderId, folderData)
                newFolder.parent = folder;
                folder.subFolders.push(newFolder);
                return newFolder;
            }
        }
        return null;
    }

    remove(folderId: I) {
        for (const folder of this.preOrderTraversal()) {
            const filteredSubFolders = folder.subFolders.filter(subFolder => subFolder.id !== folderId);
            if (filteredSubFolders.length !== folder.subFolders.length) {
                folder.subFolders = filteredSubFolders;
                return true;
            }
        }
        return false;
    }

    find(folderId: I): FolderTreeNode<I, D> | null {
        for (const folder of this.preOrderTraversal()) {
            if (folder.id === folderId) return folder;
        }
        return null;
    }
}

