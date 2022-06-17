import Tree, {KeyType, TreeNode} from "../helpers/tree";
import {useCallback, useState} from "react";

interface SimpleItem<K> {
    parent: K,
    id: K
}

interface CompleteItem<K> extends TreeNode<K> {
    parent?: TreeNode<K>
}

export default function useTree<K extends KeyType, V extends CompleteItem<K>>(rootId: K) {
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

    function setItems(items: SimpleItem<K>[]) {
        type ItemType = SimpleItem<K> & { done: boolean }
        type ReduceAccType = Record<K, ItemType>

        const itemsById = items.reduce<ReduceAccType>((acc, item) => {
                acc[item.id] = {...item, done: false}
                return acc
            },
            {} as ReduceAccType
        );

        for (const item of Object.values<ItemType>(itemsById)) {
            const stack: SimpleItem<K>[] = [item];

            let currentItem = item
            while (currentItem.parent !== rootId && !currentItem.done) {
                stack.unshift(currentItem)
                currentItem.done = true;
                currentItem = itemsById[currentItem.parent]
            }

            for (const stackItem of stack) {
                insertItem(stackItem)
            }
        }
    }

    const getItems = useCallback<() => V[]>(
        () => {
            return (itemsTree.getItems() || []) as V[]
        },
        [itemsTree],
    );

    return {
        getItems, insertItem, removeItem, moveItem, getPathTo, setItems
    }


}