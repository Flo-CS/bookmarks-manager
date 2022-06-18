import Tree, {TreeKeyType, TreeNode} from "../helpers/tree";
import {useState} from "react";

interface SimpleCollection<K> {
    parent: K,
    id: K
}

interface CompleteCollection<K> extends TreeNode<K> {
    parent?: CompleteCollection<K>
}

export default function useCollectionsTree<K extends TreeKeyType, V extends CompleteCollection<K>>(rootId: K) {
    const [collectionsTree, setCollectionsTree] = useState<Tree<K>>(new Tree<K>({
        id: rootId,
    }));

    function insertCollection(collection: SimpleCollection<K>, index?: number) {
        const newCollection: CompleteCollection<K> = {
            ...collection,
            parent: collectionsTree.find(collection.parent) || collectionsTree.root,
        }

        setCollectionsTree((collections) => {
            const collectionsTree = new Tree(collections.root).insert(collection.parent, newCollection, index)
            return collectionsTree || collections
        })
    }

    function removeCollection(collectionId: K) {
        setCollectionsTree((collections) => {
            const collectionsTree = new Tree(collections.root).remove(collectionId)
            return collectionsTree || collections
        })
    }

    function moveCollection(collectionId: K, destinationCollectionId: K, index?: number) {
        setCollectionsTree((collections) => {
            const collectionsTree = new Tree(collections.root).move(collectionId, destinationCollectionId, index)
            return collectionsTree || collections
        })
    }

    function getPathToCollection(collectionId: K): V[] {
        return collectionsTree.findPath(collectionId) as V[]
    }

    function addCollections(collections: SimpleCollection<K>[]) {
        type CollectionType = SimpleCollection<K> & { done: boolean }
        type CollectionsByIdType = Record<K, CollectionType>

        const collectionsById = collections.reduce<CollectionsByIdType>((acc, collection) => {
                acc[collection.id] = {...collection, done: false}
                return acc
            },
            {} as CollectionsByIdType
        );

        for (const collection of Object.values<CollectionType>(collectionsById)) {
            const stack: SimpleCollection<K>[] = [collection];

            let currentCollection = collection
            while (currentCollection && currentCollection.parent !== rootId && !currentCollection.done) {
                stack.unshift(currentCollection)
                currentCollection.done = true;
                currentCollection = collectionsById[currentCollection.parent]
            }

            for (const stackCollection of stack) {
                insertCollection(stackCollection)
            }
        }
    }

    function getCollectionsChildren(id?: K) {
        return (collectionsTree.getChildren(id) || []) as V[]
    }

    return {
        getCollectionsChildren,
        insertCollection,
        removeCollection,
        moveCollection,
        getPathToCollection,
        addCollections
    }
}