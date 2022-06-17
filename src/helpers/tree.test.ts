import Tree from "./tree";

describe("Collections helpers", () => {
    let tree: Tree<string>;
    const rootOriginal = {id: "root"}

    beforeEach(() => {
        tree = new Tree(rootOriginal)

        tree.insert("root", {id: "1"}, 0)
        tree.insert("root", {id: "2"}, 1)
        tree.insert("1", {id: "11"}, 0)
        tree.insert("11", {id: "111"}, 0)
        tree.insert("11", {id: "112"}, 1)
    })

    it("root is a copy of object passed in constructor", () => {
        expect(tree.root).not.toBe(rootOriginal)
    })

    it("all nodes nodes are correctly added", () => {
        const root = tree.root
        const node1 = root.children?.[0]
        const node2 = root.children?.[1]
        const node11 = node1?.children?.[0]
        const node111 = node11?.children?.[0]
        const node112 = node11?.children?.[1]

        expect(root.id).toBe("root")
        expect(node1?.id).toBe("1")
        expect(node2?.id).toBe("2")
        expect(node11?.id).toBe("11")
        expect(node111?.id).toBe("111")
        expect(node112?.id).toBe("112")
    })
    it("node is correctly added and return null if parent node doesn't exist or if node is already in the tree", () => {
        let result = tree.insert("root", {id: "test"}, 599)
        expect(result?.root?.children?.[2]).toEqual({id: "test"})
        expect(result?.root?.children).toHaveLength(3);

        result = tree.insert("11", {id: "test1"}, 1)
        expect(result?.root?.children?.[0]?.children?.[0]?.children?.[1]).toEqual({id: "test1"})
        expect(result?.root?.children?.[0]?.children?.[0]?.children).toHaveLength(3);

        result = tree.insert("11", {id: "test2"}, 0)
        expect(result?.root?.children?.[0]?.children?.[0]?.children?.[0]).toEqual({id: "test2"})
        expect(result?.root?.children?.[0]?.children?.[0]?.children).toHaveLength(4);

        // Already exists
        result = tree.insert("root", {id: "test"})
        expect(result).toBe(null)

        // Parent node it doesn't exist
        result = tree.insert("rooooooooooooooooooooooot", {id: "test3"})
        expect(result).toBe(null)
    })
    it("node is correctly removed and if it can't be removed return null", () => {
        let result = tree.remove("doesn't exist")
        expect(result).toBe(null)
        result = tree.remove("11")
        expect(result).not.toBe(null)
        expect(result?.root.children?.[0].children).toEqual([])
    })
    it("can find node inside tree", () => {
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
    it("moves nodes correctly", () => {
        // Doesn't move the node id source or destination doesn't exist
        let result = tree.move("doesn't exist", "root");
        expect(result).toBe(null)
        result = tree.move("1", "doesn't exist");
        expect(result).toBe(null)
        // Don't move root
        result = tree.move("root", "1")
        expect(result).toBe(null)

        tree.move("112", "2")
        // Old parent node test
        const oldParentCollection = tree.find("11")
        expect(oldParentCollection?.children).toHaveLength(1)
        expect(oldParentCollection?.children?.[0].id).toBe("111")

        // New parent node test
        const newParentCollection = tree.find("2")
        expect(newParentCollection?.children).toHaveLength(1)
        expect(newParentCollection?.children?.[0].id).toBe("112")
    })
})