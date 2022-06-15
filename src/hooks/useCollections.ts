import Tree from "../helpers/tree";
import {useMemo, useState} from "react";
import {BookmarksCollection} from "../helpers/collections";

export default function useCollections(initCollections: BookmarksCollection[], rootKey: string) {
    const [collectionsTree, setCollectionsTree] = useState<Tree<string>>(new Tree({
        key: rootKey,
        children: initCollections
    }));

    function insertCollection(parentCollectionKey: string, collection: BookmarksCollection, index?: number) {
        setCollectionsTree((collections) => {
            const collectionsTree = new Tree(collections.root).insert(parentCollectionKey, collection, index)
            return collectionsTree || collections
        })
    }

    function removeCollection(collectionKey: string) {
        setCollectionsTree((collections) => {
            const collectionsTree = new Tree(collections.root).remove(collectionKey)
            return collectionsTree || collections
        })
    }

    function moveCollection(collectionKey: string, destinationCollectionKey: string, index?: number) {
        setCollectionsTree((collections) => {
            const collectionsTree = new Tree(collections.root).move(collectionKey, destinationCollectionKey, index)
            return collectionsTree || collections
        })
    }

    function getPathTo(collectionKey: string): BookmarksCollection[] {
        return collectionsTree.findPath(collectionKey) as BookmarksCollection[]
    }

    const collectionsRoot = useMemo(() => collectionsTree.root, [collectionsTree]) as BookmarksCollection;
    return {
        collectionsRoot, insertCollection, removeCollection, moveCollection, getPathTo
    }


}