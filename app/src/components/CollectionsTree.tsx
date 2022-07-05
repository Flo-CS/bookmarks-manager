import React from "react";
import CollectionTreeItem from "./CollectionTreeItem";
import {TopCollections} from "../../utils/collections";
import {IdDroppedItem} from "../../types/dragAndDrop";

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
    children?: React.ReactNode
    selectedCollectionId?: string
    onCollectionClick?: (collectionId: string) => void
    afterCollectionFoldingChange?: (collectionId: string, isFolded: boolean) => void
    menuItems?: string[]
    onMenuItemClick?: (menuItemId: string, collectionId: string) => void
    onDrop?: (parentCollectionId: string, droppedItem: IdDroppedItem) => void
    canDrop?: (parentCollectionId: string, droppedItem: IdDroppedItem) => boolean
    afterCollectionNameChange?: (newName: string, collectionId?: string) => void
    nameEditedCollectionId?: string
}

export default function CollectionsTree({
                                            collections,
                                            children,
                                            selectedCollectionId,
                                            onCollectionClick,
                                            afterCollectionFoldingChange,
                                            menuItems,
                                            onMenuItemClick,
                                            onDrop,
                                            canDrop,
                                            afterCollectionNameChange,
                                            nameEditedCollectionId
                                        }: Props) {


    function collectionsToComponent(collections: TreeCollection[]) {
        return collections.map((collection) => {
            return <React.Fragment key={collection.id}>
                <CollectionTreeItem collectionId={collection.id}
                                    parentCollectionId={collection.parent?.id || TopCollections.MAIN}
                                    index={collection.index + 1}
                                    icon={collection.icon}
                                    name={collection.name}
                                    isDefaultFolded={collection.isFolded}
                                    onClick={onCollectionClick}
                                    isSelected={collection.id === selectedCollectionId}
                                    afterFoldingChange={afterCollectionFoldingChange}
                                    menuItems={menuItems}
                                    onMenuItemClick={onMenuItemClick}
                                    count={collection.count}
                                    onDrop={onDrop}
                                    canDrop={canDrop}
                                    isCollectionNameEdited={nameEditedCollectionId === collection.id}
                                    afterCollectionNameChange={afterCollectionNameChange}
                >
                    {collection.children && collectionsToComponent(collection.children)}
                </CollectionTreeItem>
            </React.Fragment>
        })

    }

    // Add onClick handler and isSelected prop to children CollectionTreeItem
    // TODO: Improve this ?
    const childrenWithSelectionHandlers = React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child, {
                ...child.props,
                onClick: onCollectionClick,
                isSelected: child.props.collectionId === selectedCollectionId,
            } as Props)
        }
    })

    return <section>
        {childrenWithSelectionHandlers || collections && collectionsToComponent(collections)}
    </section>
}