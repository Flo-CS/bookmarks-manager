export class TreeNode<I, D> {
    children: TreeNode<I, D>[];
    key: I;
    data?: D;
    parent: TreeNode<I, D> | null;

    constructor(key: I, data?: D) {
        this.children = [];
        this.parent = null;
        this.key = key;
        this.data = data;
    }
}

export class Tree<I, D> {
    root: TreeNode<I, D>;

    constructor(key: I, data?: D) {
        this.root = new TreeNode<I, D>(key, data)
    }

    * preOrderTraversal(node = this.root): IterableIterator<TreeNode<I, D>> {
        yield node;
        if (node.children.length) {
            for (const child of node.children) {
                yield* this.preOrderTraversal(child);
            }
        }
    }

    insert(parentNodeKey: I, nodeKey: I, data?: D) {
        if (this.find(nodeKey)) return null;

        for (const node of this.preOrderTraversal()) {
            if (node.key === parentNodeKey) {
                const newNode = new TreeNode<I, D>(nodeKey, data)
                newNode.parent = node;
                node.children.push(newNode);
                return newNode;
            }
        }
        return null;
    }

    remove(nodeKey: I) {
        for (const node of this.preOrderTraversal()) {
            const filteredChildren = node.children.filter(child => child.key !== nodeKey);
            if (filteredChildren.length !== node.children.length) {
                node.children = filteredChildren;
                return true;
            }
        }
        return false;
    }

    find(nodeKey: I): TreeNode<I, D> | null {
        for (const node of this.preOrderTraversal()) {
            if (node.key === nodeKey) return node;
        }
        return null;
    }

    moveNode(nodeKey: I, destinationNodeKey: I): boolean {
        const node = this.find(nodeKey);
        const destinationNode = this.find(destinationNodeKey);

        if (!node || !destinationNode) return false;
        if (node === this.root) return false;
        if (!node.parent) return false; // Normally, this case will never happen because the only node without parent is root

        node.parent.children = node.parent.children.filter(subNode => subNode.key !== nodeKey)
        node.parent = destinationNode
        destinationNode.children.push(node)

        return true;
    }
}
