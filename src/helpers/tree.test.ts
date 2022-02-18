import {Tree} from "./tree";

describe("Folders helpers", () => {
    let tree: Tree<string, string>;

    beforeEach(() => {
        tree = new Tree("root")

        tree.insert("root", "1")
        tree.insert("root", "2")
        tree.insert("1", "11")
        tree.insert("11", "111")
        tree.insert("11", "112")
    })

    it("all folders nodes are correctly added", () => {
        const root = tree.root
        const folder1 = root.children[0]
        const folder2 = root.children[1]
        const folder11 = folder1.children[0]
        const folder111 = folder11.children[0]
        const folder112 = folder11.children[1]

        expect(root.key).toBe("root")
        expect(folder1.key).toBe("1")
        expect(folder2.key).toBe("2")
        expect(folder11.key).toBe("11")
        expect(folder111.key).toBe("111")
        expect(folder112.key).toBe("112")

        expect(root.parent).toBe(null)
        expect(folder1.parent?.key).toBe("root")
        expect(folder2.parent?.key).toBe("root")
        expect(folder11.parent?.key).toBe("1")
        expect(folder111.parent?.key).toBe("11")
        expect(folder112.parent?.key).toBe("11")
    })
    it("folder is correctly added and returns added folder node if parent folder exists and if folder isn't already in the tree else null", () => {
        let result = tree.insert("root", "test", "testD")
        expect(result?.key).toBe("test")
        expect(result?.children).toEqual([]);
        expect(result?.parent?.key).toBe("root")
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
        expect(tree.root.children[0].children).toEqual([])
    })
    it("can find folder node inside tree", () => {
        let result = tree.find("doesn't exist")
        expect(result).toBe(null)
        result = tree.find("11")
        expect(result?.key).toBe("11")
        result = tree.find("root")
        expect(result?.key).toBe("root")
        result = tree.find("112")
        expect(result?.key).toBe("112")
    })
    it("preOrderTraversal is valid", () => {
        const preOrderTraversal = tree.preOrderTraversal();
        expect(preOrderTraversal.next().value.key).toEqual("root")
        expect(preOrderTraversal.next().value.key).toEqual("1")
        expect(preOrderTraversal.next().value.key).toEqual("11")
        expect(preOrderTraversal.next().value.key).toEqual("111")
        expect(preOrderTraversal.next().value.key).toEqual("112")
        expect(preOrderTraversal.next().value.key).toEqual("2")
        expect(preOrderTraversal.next().done).toEqual(true)
    })
    it("moves folder correctly", () => {
        // Doesn't move the folder id source or destination doesn't exist
        let result = tree.moveNode("doesn't exist", "root");
        expect(result).toBe(false)
        result = tree.moveNode("1", "doesn't exist");
        expect(result).toBe(false)
        // Don't move root
        result = tree.moveNode("root", "1")
        expect(result).toBe(false)

        tree.moveNode("112", "2")
        // Old parent folder test
        const oldParentFolder = tree.find("11")
        expect(oldParentFolder?.children).toHaveLength(1)
        expect(oldParentFolder?.children[0].key).toBe("111")

        // Moved folder test
        const movedFolder = tree.find("112")
        expect(movedFolder?.parent?.key).toBe("2")

        // New parent folder test
        const newParentFolder = tree.find("2")
        expect(newParentFolder?.children).toHaveLength(1)
        expect(newParentFolder?.children[0].key).toBe("112")
    })
})