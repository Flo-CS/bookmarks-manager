import React from "react";
import CollectionTreeItem, {CollectionTreeItemProps} from "./CollectionTreeItem";
import {BookmarksCollection} from "../helpers/collections";

type Props = {
    collections?: BookmarksCollection[],
    children?: React.ReactNode,
    selectedCollectionId?: string,
    onCollectionClick?: (collectionId: string) => void
}

export default function CollectionsTree({collections, children, selectedCollectionId, onCollectionClick}: Props) {

    function handleCollectionClick(collectionId: string) {
        onCollectionClick && onCollectionClick(collectionId)
    }

    function collectionsToComponent(collections: BookmarksCollection[]) {
        return collections.map((collection) => {
            const commonProps = {
                key: collection.key,
                collectionId: collection.key,
                name: collection.name,
                icon: collection.icon,
                count: collection.count,
                isDefaultFolded: collection.isFolded,
                onClick: handleCollectionClick,
                isSelected: collection.key === selectedCollectionId,
            }
            if (collection.children) {
                return <CollectionTreeItem {...commonProps}>
                    {collectionsToComponent(collection.children)}
                </CollectionTreeItem>
            }
            return <CollectionTreeItem {...commonProps}/>
        })

    }

    // Add onClick handler and isSelected prop to children CollectionTreeItem
    // TODO: Improve this ?
    const childrenWithSelectionHandlers = React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child, {
                ...child.props,
                onClick: handleCollectionClick,
                isSelected: child.props.collectionId === selectedCollectionId,
            } as CollectionTreeItemProps)
        }
    })

    return <section>
        {childrenWithSelectionHandlers || collections && collectionsToComponent(collections)}
    </section>
}