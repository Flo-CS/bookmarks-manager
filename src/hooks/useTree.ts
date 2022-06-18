import Tree, {TreeKeyType, TreeNode} from "../helpers/tree";
import {useState} from "react";

interface SimpleItem<K> {
    parent: K,
    id: K
}

interface CompleteItem<K> extends TreeNode<K> {
    parent?: TreeNode<K>
}

export default function useTree<K extends TreeKeyType, V extends CompleteItem<K>>(rootId: K) {
    const [itemsTree, setItemsTree] = useState<Tree<K>>(new Tree<K>({
        id: rootId,
    }));

    function insertItem(item: SimpleItem<K>, index?: number) {
        const newItem: CompleteItem<K> = {
            ...item,
            parent: itemsTree.find(item.parent) || itemsTree.root,
        }

        setItemsTree((items) => {
            const itemsTree = new Tree(items.root).insert(item.parent, newItem, index)
            return itemsTree || items
        })
    }

    function removeItem(itemId: K) {
        setItemsTree((items) => {
            const itemsTree = new Tree(items.root).remove(itemId)
            return itemsTree || items
        })
    }

    function moveItem(itemId: K, destinationItemId: K, index?: number) {
        setItemsTree((items) => {
            const itemsTree = new Tree(items.root).move(itemId, destinationItemId, index)
            return itemsTree || items
        })
    }

    function getPathTo(itemId: K): V[] {
        return itemsTree.findPath(itemId) as V[]
    }

    function addItems(items: SimpleItem<K>[]) {
        type ItemType = SimpleItem<K> & { done: boolean }
        type ItemsByIdType = Record<K, ItemType>

        const itemsById = items.reduce<ItemsByIdType>((acc, item) => {
                acc[item.id] = {...item, done: false}
                return acc
            },
            {} as ItemsByIdType
        );

        for (const item of Object.values<ItemType>(itemsById)) {
            const stack: SimpleItem<K>[] = [item];

            let currentItem = item
            while (currentItem && currentItem.parent !== rootId && !currentItem.done) {
                stack.unshift(currentItem)
                currentItem.done = true;
                currentItem = itemsById[currentItem.parent]
            }

            for (const stackItem of stack) {
                insertItem(stackItem)
            }
        }
    }

    function getItemChildren(id?: K) {
        return (itemsTree.getChildren(id) || []) as V[]
    }

    return {
        getItemChildren, insertItem, removeItem, moveItem, getPathTo, addItems
    }
}