import {forEach, keyBy, mapValues, pickBy} from "lodash";
import {useMemo, useState} from "react";

type NodeKey = string | number

type TreeOptions<Node, LeafChild> = {
    rootNodes?: Node[],
    leafChildren?: LeafChild[],
    getLeafChildParent?: (leafChild: LeafChild) => NodeKey,
    getKey?: (node: Node) => NodeKey,
    getParent?: (node: Node) => NodeKey | undefined,
    getIndex?: (node: Node) => number
}

type TreeNode<Node> = Node & {
    children?: TreeNode<Node>[],
    parent?: TreeNode<Node>,
    count: number,
    __key__: NodeKey,
    __childrenKeys__: NodeKey[],
    __parentKey__: NodeKey
}

export default function useTree<Node extends Record<string, unknown>>({
                                                                          rootNodes = [],
                                                                          getParent = (item) => item.parent as NodeKey,
                                                                          getKey = (item) => item.key as NodeKey,
                                                                          getIndex = (item) => item.index as number,
                                                                          leafChildren = [],
                                                                          getLeafChildParent = (leafChild) => leafChild.parent as NodeKey
                                                                      }: TreeOptions<Node, any>) {


    const [unlinkedNodesByKey, setNodesByKey] = useState<Record<NodeKey, Node>>(
        keyBy(rootNodes, (node) => getKey(node))
    );

    const treeNodesByKey = useMemo<Record<NodeKey, TreeNode<Node>>>(() => {
        return buildTree();
    }, [unlinkedNodesByKey, getParent, getKey]);

    const tree = useMemo<Record<NodeKey, TreeNode<Node>>>(() => {
        return fillTree(treeNodesByKey)
    }, [treeNodesByKey, leafChildren, getLeafChildParent])

    function buildTree(): Record<NodeKey, TreeNode<Node>> {
        const nodesByKey = mapValues(unlinkedNodesByKey, (unlinkedNode, unlinkedNodeKey) => {
            const newNode = {
                ...unlinkedNode,
                get parent(): TreeNode<Node> | undefined {
                    return this.__parentKey__ ? nodesByKey[this.__parentKey__] : undefined
                },
                get children(): TreeNode<Node>[] {
                    return this.__childrenKeys__.map(childKey => nodesByKey[childKey]).sort((child1, child2) => getIndex(child1) - getIndex(child2))
                },
                count: 0,
                __key__: unlinkedNodeKey,
                __parentKey__: getParent(unlinkedNode),
                __childrenKeys__: [],
            }

            return newNode as TreeNode<Node>
        })

        return nodesByKey;
    }

    function fillTree(tree: Record<NodeKey, TreeNode<Node>>): Record<NodeKey, TreeNode<Node>> {
        return forEach(tree, (node, nodeKey) => {
            if (node.parent) {
                node.parent.__childrenKeys__.push(node.__key__)
                node.__parentKey__ = node.parent.__key__
            }
            node.count = leafChildren?.filter(leafChild => getLeafChildParent(leafChild) === nodeKey).length
        })
    }

    function getTreeNode(nodeKey: NodeKey): TreeNode<Node> {
        return tree[nodeKey]
    }

    function getTreeNodeChildren(nodeKey: NodeKey): TreeNode<Node>[] {
        return getTreeNode(nodeKey).children || []
    }

    function insertNode(node: Node): void {
        setNodesByKey((nodes) => {
            return {...nodes, [getKey(node)]: node}
        })
    }

    function insertNodes(newNodes: Node[]): void {
        setNodesByKey((nodes) => {
            return {...nodes, ...keyBy(newNodes, (node) => getKey(node))}
        })
    }

    function removeNode(nodeKey: NodeKey): void {
        setNodesByKey((nodes) => {
            return pickBy(nodes, (node) => getKey(node) !== nodeKey)
        })
    }

    function updateNode(nodeKey: NodeKey, data: Partial<Node>): void {
        setNodesByKey((nodes) => {
            return {...nodes, [nodeKey]: {...nodes[nodeKey], ...data}}
        })
    }

    function getPathToTreeNode(nodeKey: NodeKey): TreeNode<Node>[] {
        let currentNode: TreeNode<Node> | undefined = getTreeNode(nodeKey)
        const stack: TreeNode<Node>[] = []

        while (currentNode) {
            stack.push(currentNode)
            currentNode = currentNode.parent
        }
        return stack.reverse()
    }

    return {
        insertNode,
        updateNode,
        removeNode,
        getPathToTreeNode,
        insertNodes,
        getTreeNode,
        getTreeNodeChildren,
    }
}