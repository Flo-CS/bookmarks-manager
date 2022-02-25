export interface TreeNode<K> {
    children?: TreeNode<K>[];
    key: K;
}

export default class Tree<K>{
    readonly root: TreeNode<K>;

    constructor(root: TreeNode<K>) {
        this.root = Object.assign({}, root);
    }

    * preOrderTraversal(root: TreeNode<K> = this.root): IterableIterator<TreeNode<K>> {
        yield root;
        if (root.children?.length) {
            for (const child of root.children) {
                yield* this.preOrderTraversal(child);
            }
        }
    }

    find(nodeKey: K, root: TreeNode<K> = this.root): TreeNode<K> | null {
        for (const node of this.preOrderTraversal(root)) {
            if (node.key === nodeKey) return node;
        }
        return null;
    }

    insert(parentNodeKey: K, newNode: TreeNode<K>, index: number = 0): Tree<K> | null {
        if (this.find(newNode.key, this.root)) return null;
        index = index < 0 ? 0 : index;

        for (const parentNode of this.preOrderTraversal()) {
            if (parentNode.key === parentNodeKey) {
                const parentChildren = parentNode.children || []

                parentNode.children = [...parentChildren.slice(0, index), newNode, ...parentChildren.slice(index)];
                return this

            }
        }

        return null;
    }

    remove(nodeKey: K): Tree<K> | null {
        for (const node of this.preOrderTraversal(this.root)) {
            if (!node.children) continue

            // No need to filter for other potential nodes because in tree, node have only one predecessor
            if (node.children.find((val) => val.key === nodeKey)) {
                node.children = node.children.filter(child => child.key !== nodeKey);
                return this;
            }
        }
        return null
    }

    move(nodeKey: K, destinationNodeKey: K, index: number = 0): Tree<K> | null {
        const node = this.find(nodeKey, this.root);
        const destinationNode = this.find(destinationNodeKey, this.root);

        if (!node || !destinationNode) return null;
        if (node === this.root) return null;

        // Return on null ?
        this.remove(nodeKey)
        this.insert(destinationNodeKey, node, index)

        return this
    }
}

