import {FoldersTree} from "./folders";

describe("Folders helpers", () => {
    let tree: FoldersTree<string, string>;

    beforeEach(() => {
        tree = new FoldersTree("root")

        tree.insert("root", "1")
        tree.insert("root", "2")
        tree.insert("1", "11")
        tree.insert("11", "111")
        tree.insert("11", "112")
    })

    it("all folders nodes are correctly added", () => {
        const root = tree.rootFolder
        const folder1 = root.subFolders[0]
        const folder2 = root.subFolders[1]
        const folder11 = folder1.subFolders[0]
        const folder111 = folder11.subFolders[0]
        const folder112 = folder11.subFolders[1]

        expect(root.id).toBe("root")
        expect(folder1.id).toBe("1")
        expect(folder2.id).toBe("2")
        expect(folder11.id).toBe("11")
        expect(folder111.id).toBe("111")
        expect(folder112.id).toBe("112")

        expect(root.parent).toBe(null)
        expect(folder1.parent?.id).toBe("root")
        expect(folder2.parent?.id).toBe("root")
        expect(folder11.parent?.id).toBe("1")
        expect(folder111.parent?.id).toBe("11")
        expect(folder112.parent?.id).toBe("11")
    })
    it("folder is correctly added and returns added folder node if parent folder exists and if folder isn't already in the tree else null", () => {
        let result = tree.insert("root", "test", "testD")
        expect(result?.id).toBe("test")
        expect(result?.subFolders).toEqual([]);
        expect(result?.parent?.id).toBe("root")
        expect(result?.data).toBe("testD")

        // Already exists
        result = tree.insert("root", "test", "testD")
        expect(result).toBe(null)

        // Parent folder it doesn't exist
        result = tree.insert("rooooooooooooooooooooooot", "root", "root")
        expect(result).toBe(null)
    })
    it("folder is correctly removed and returns true if folder was removed else false", () => {
        let result = tree.remove("doesn't exist")
        expect(result).toBe(false)
        result = tree.remove("11")
        expect(result).toBe(true)
        expect(tree.rootFolder.subFolders[0].subFolders).toEqual([])
    })
    it("can find folder node inside tree", () => {
        let result = tree.find("doesn't exist")
        expect(result).toBe(null)
        result = tree.find("11")
        expect(result?.id).toBe("11")
        result = tree.find("root")
        expect(result?.id).toBe("root")
        result = tree.find("112")
        expect(result?.id).toBe("112")
    })
    it("preOrderTraversal is valid", () => {
        const preOrderTraversal = tree.preOrderTraversal();
        expect(preOrderTraversal.next().value.id).toEqual("root")
        expect(preOrderTraversal.next().value.id).toEqual("1")
        expect(preOrderTraversal.next().value.id).toEqual("11")
        expect(preOrderTraversal.next().value.id).toEqual("111")
        expect(preOrderTraversal.next().value.id).toEqual("112")
        expect(preOrderTraversal.next().value.id).toEqual("2")
        expect(preOrderTraversal.next().done).toEqual(true)
    })
    it("moves folder correctly", () => {
        // Doesn't move the folder id source or destination doesn't exist
        let result = tree.moveFolder("doesn't exist", "root");
        expect(result).toBe(false)
        result = tree.moveFolder("1", "doesn't exist");
        expect(result).toBe(false)
        // Don't move root
        result = tree.moveFolder("root", "1")
        expect(result).toBe(false)

        tree.moveFolder("112", "2")
        // Old parent folder test
        const oldParentFolder = tree.find("11")
        expect(oldParentFolder?.subFolders).toHaveLength(1)
        expect(oldParentFolder?.subFolders[0].id).toBe("111")

        // Moved folder test
        const movedFolder = tree.find("112")
        expect(movedFolder?.parent?.id).toBe("2")

        // New parent folder test
        const newParentFolder = tree.find("2")
        expect(newParentFolder?.subFolders).toHaveLength(1)
        expect(newParentFolder?.subFolders[0].id).toBe("112")
    })
})