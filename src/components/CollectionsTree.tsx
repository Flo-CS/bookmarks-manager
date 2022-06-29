import React from "react";
import CollectionTreeItem from "./CollectionTreeItem";
import {TreeOutputCollection} from "../helpers/collections";
import {IdDroppedItem} from "../helpers/dragAndDrop";
import CollectionTreeSeparatorItem from "./CollectionTreeSeparatorItem";


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
            return <React.Fragment key={collection.id}>
                <CollectionTreeItem collectionId={collection.id}
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
                                    canDrop={canDrop}>
                    {collection.children && collectionsToComponent(collection.children)}
                    <CollectionTreeSeparatorItem
                        parentCollectionId={collection.id}
                        index={collection.index + 1}
                        onDrop={onDrop} canDrop={canDrop} key={collection.index}/>
                </CollectionTreeItem>
                <CollectionTreeSeparatorItem
                    parentCollectionId={collection.parent?.id || collection.id}
                    index={(collection.parent?.index || collection.index) + 1}
                    onDrop={onDrop} canDrop={canDrop} key={collection.index}/>
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