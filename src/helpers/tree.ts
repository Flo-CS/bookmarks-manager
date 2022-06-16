// TODO: use parent ?
export interface TreeNode<K, V> {
    children?: TreeNode<K, V>[];
    id: K;
}

export type KeyType = number | string | symbol;

export default class Tree<K extends KeyType, V extends TreeNode<K, V>> {
    readonly root: TreeNode<K, V>;

    constructor(root: TreeNode<K, V>) {
        this.root = Object.assign({}, root);
    }

    getRoot(): V {
        return this.root as V;
    }

    * preOrderTraversal(root: TreeNode<K, V> = this.root): IterableIterator<TreeNode<K, V>> {
        yield root;
        if (root.children?.length) {
            for (const child of root.children) {
                yield* this.preOrderTraversal(child);
            }
        }
    }

    find(nodeId: K, root: TreeNode<K, V> = this.root): TreeNode<K, V> | null {
        for (const node of this.preOrderTraversal(root)) {
            if (node.id === nodeId) return node;
        }
        return null;
    }

    insert(parentNodeId: K, newNode: TreeNode<K, V>, index: number = 0): Tree<K, V> | null {
        if (this.find(newNode.id, this.root)) return null;
        index = index < 0 ? 0 : index;

        for (const parentNode of this.preOrderTraversal()) {
            if (parentNode.id === parentNodeId) {
                const parentChildren = parentNode.children || []

                parentNode.children = [...parentChildren.slice(0, index), newNode, ...parentChildren.slice(index)];
                return this

            }
        }

        return null;
    }

    remove(nodeId: K): Tree<K, V> | null {
        for (const node of this.preOrderTraversal(this.root)) {
            if (!node.children) continue

            // No need to filter for other potential nodes because in tree, node have only one predecessor
            if (node.children.find((val) => val.id === nodeId)) {
                node.children = node.children.filter(child => child.id !== nodeId);
                return this;
            }
        }
        return null
    }

    move(nodeId: K, destinationNodeId: K, index: number = 0): Tree<K, V> | null {
        const node = this.find(nodeId, this.root);
        const destinationNode = this.find(destinationNodeId, this.root);

        if (!node || !destinationNode) return null;
        if (node === this.root) return null;

        // Return on null ?
        this.remove(nodeId)
        this.insert(destinationNodeId, node, index)

        return this
    }

    // TODO: maybe improve this ? because it's not a pure function, not very efficient and readable
    findPath(nodeId: K) {
        const path: TreeNode<K, V>[] = [];

        const findPathRec = (node: TreeNode<K, V>) => {
            if (node.id === nodeId) {
                path.push(node);
                return true;
            }
            if (node.children) {
                for (const child of node.children) {
                    if (findPathRec(child)) {
                        path.push(node);
                        return true;
                    }
                }
            }
            return false;
        }

        findPathRec(this.root);

        return path.slice(0, -1).reverse();
    }

}


