import {forEach, keyBy, mapValues, pickBy} from "lodash";
import {useMemo, useState} from "react";

type NodeKey = string | number

type TreeOptions<V> = {
    rootsNodes?: V[],
    getKey?: (node: Record<NodeKey, any>) => NodeKey,
    getParent?: (node: Record<NodeKey, any>) => NodeKey,
    childrenPropertyName?: NodeKey,
    parentPropertyName?: NodeKey,
    keyPropertyName?: NodeKey
}

type TreeNode<V> = V & {
    children?: TreeNode<V>[],
    parent: TreeNode<V>,
    __key__: NodeKey,
    __childrenKeys__: NodeKey[],
    __parentKey__: NodeKey
}

export default function useTree<V>({
                                       rootsNodes,
                                       getParent = (item) => item.parent,
                                       getKey = (item) => item.key,
                                   }: TreeOptions<V>) {


    const [unlinkedNodesByKey, setNodesByKey] = useState<Record<NodeKey, V>>(
        keyBy(rootsNodes, (node) => getKey(node))
    );

    const tree = useMemo<Record<NodeKey, TreeNode<V>>>(() => {
        return buildTree();
    }, [unlinkedNodesByKey]);

    function buildTree(): Record<NodeKey, TreeNode<V>> {
        const nodesByKey = mapValues(unlinkedNodesByKey, (unlinkedNode) => {
            const newNode = {
                ...unlinkedNode,
                get parent(): TreeNode<V> {
                    return nodesByKey[this.__parentKey__]
                },
                get children(): TreeNode<V>[] {
                    return this.__childrenKeys__.map(key => nodesByKey[key])
                },
                __key__: getKey(unlinkedNode),
                __parentKey__: getParent(unlinkedNode),
                __childrenKeys__: [],
            }

            return newNode as TreeNode<V>
        })

        forEach(nodesByKey, (node) => {
            if (node.parent) {
                node.parent.__childrenKeys__.push(node.__key__)
                node.__parentKey__ = node.parent.__key__
            }
        })

        return nodesByKey;
    }

    function getTreeNode(nodeKey: NodeKey): TreeNode<V> {
        return tree[nodeKey]
    }

    function getTreeNodeParent(nodeKey: NodeKey): TreeNode<V> | undefined {
        return getTreeNode(nodeKey).parent
    }

    function getTreeNodeChildren(nodeKey: NodeKey): TreeNode<V>[] {
        return getTreeNode(nodeKey).children || []
    }

    function insertNode(node: V): void {
        setNodesByKey((nodes) => {
            return {...nodes, [getKey(node)]: node}
        })
    }

    function insertNodes(newNodes: V[]): void {
        setNodesByKey((nodes) => {
            return {...nodes, ...keyBy(newNodes, (node) => getKey(node))}
        })
    }

    function removeNode(nodeKey: NodeKey): void {
        setNodesByKey((nodes) => {
            return pickBy(nodes, (node) => getKey(node) !== nodeKey)
        })
    }

    function updateNode(nodeKey: NodeKey, data: Partial<V>): void {
        setNodesByKey((nodes) => {
            return {...nodes, [nodeKey]: {...nodes[nodeKey], ...data}}
        })
    }

    function getPathToTreeNode(nodeKey: NodeKey): TreeNode<V>[] {
        let currentNode: TreeNode<V> | undefined = getTreeNode(nodeKey)
        const stack: TreeNode<V>[] = []

        while (currentNode?.parent) {
            stack.push(currentNode)
            currentNode = currentNode.parent
        }
        return stack
    }

    return {
        insertNode,
        updateNode,
        removeNode,
        getPathToTreeNode,
        insertNodes,
        getTreeNode,
        getTreeNodeChildren,
        getTreeNodeParent
    }
}