import React from "react";
import CollectionTreeItem from "./CollectionTreeItem";
import {TreeOutputCollection} from "../helpers/collections";
import {IdDroppedItem} from "../helpers/dragAndDrop";


type Props = {
    collections?: TreeOutputCollection[],
    children?: React.ReactNode,
    selectedCollectionId?: string,
    onCollectionClick?: (collectionId: string) => void,
    afterCollectionFoldingChange?: (collectionId: string, isFolded: boolean) => void,
    menuItems?: string[],
    onMenuItemClick?: (menuItemId: string, collectionId: string) => void,
    onDrop?: (parentCollectionId: string, droppedItem: IdDroppedItem) => void,
    canDrop?: (parentCollectionId: string, droppedItem: IdDroppedItem) => boolean
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
                                            canDrop
                                        }: Props) {


    function collectionsToComponent(collections: TreeOutputCollection[]) {
        return collections.map((collection) => {
            const commonProps = {
                key: collection.id,
                collectionId: collection.id,
                icon: collection.icon,
                name: collection.name,
                isDefaultFolded: collection.isFolded,
                onClick: onCollectionClick,
                isSelected: collection.id === selectedCollectionId,
                afterFoldingChange: afterCollectionFoldingChange,
                menuItems: menuItems,
                onMenuItemClick: onMenuItemClick,
                count: collection.count,
                onDrop: onDrop,
                canDrop: canDrop
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
                onClick: onCollectionClick,
                isSelected: child.props.collectionId === selectedCollectionId,
            } as Props)
        }
    })

    return <section>
        {childrenWithSelectionHandlers || collections && collectionsToComponent(collections)}
    </section>
}