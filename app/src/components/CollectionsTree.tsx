import React from "react";
import CollectionTreeItem, { CollectionsTreeRightMenuRenderProps as CollectionsTreeRightMenuRenderProps } from "./CollectionTreeItem";
import { TopCollections } from "../../utils/collections";
import { IdDroppedItem } from "../../types/dragAndDrop";
import CollectionTreeDropSeparatorItem from "./CollectionTreeDropSeparatorItem";

export interface TreeCollection {
    isFolded?: boolean;
    name: string;
    icon?: React.ComponentType;
    index: number;
    id: string;
    children?: TreeCollection[],
    parent?: TreeCollection
    count?: number
}

interface Props {
    collections?: TreeCollection[]
    children?: React.ReactElement[] | React.ReactElement
    selectedCollectionId?: string
    onCollectionClick?: (collectionId: string) => void
    afterCollectionFoldingChange?: (collectionId: string, isFolded: boolean) => void
    rightMenu?: (props: CollectionsTreeRightMenuRenderProps) => React.ReactNode
    onDrop?: (parentCollectionId: string, droppedItem: IdDroppedItem) => void
    canDrop?: (parentCollectionId: string, droppedItem: IdDroppedItem) => boolean
    afterCollectionNameChange?: (newName: string, collectionId: string) => void
    nameEditedCollectionId?: string
}

export default function CollectionsTree({
    collections = [],
    children,
    selectedCollectionId,
    onCollectionClick,
    afterCollectionFoldingChange,
    rightMenu,
    onDrop,
    canDrop,
    afterCollectionNameChange,
    nameEditedCollectionId
}: Props) {

    function collectionsToComponents(collections: TreeCollection[]) {

        return collections.map((collection) => {
            return <CollectionTreeItem
                key={collection.id}
                collectionId={collection.id}
                icon={collection.icon}
                name={collection.name}
                isDefaultFolded={collection.isFolded}
                onClick={onCollectionClick}
                isSelected={collection.id === selectedCollectionId}
                afterFoldingChange={afterCollectionFoldingChange}
                count={collection.count}
                onDrop={onDrop}
                canDrop={canDrop}
                isCollectionNameEdited={nameEditedCollectionId === collection.id}
                afterCollectionNameChange={afterCollectionNameChange}
                dropSeparator={
                    <CollectionTreeDropSeparatorItem
                        parentCollectionId={collection.parent?.id || TopCollections.MAIN}
                        index={collection.index}
                        onDrop={onDrop}
                        canDrop={canDrop} />
                }
                rightMenu={rightMenu}
            >{collection.children && collectionsToComponents(collection.children)}</CollectionTreeItem>
        })

    }

    const childrenWithSelectionHandling = React.Children.map(children, (child) => {
        return child && React.cloneElement(child, {
            onClick: onCollectionClick,
            isSelected: child.props.collectionId === selectedCollectionId
        })
    })

    return <section>
        {childrenWithSelectionHandling || collectionsToComponents(collections)}
    </section>
}