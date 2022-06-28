import React, {ChangeEvent, KeyboardEvent, useState} from "react"
import styled from "styled-components";
import CollectionsTree from "./CollectionsTree";
import CollectionTreeItem from "./CollectionTreeItem";
import {TopCollections, TreeCollectionItem, TreeOutputCollection, VirtualCollections} from "../helpers/collections";

import {MdAllInbox} from "react-icons/md";
import {IoAlbums, IoTrash} from "react-icons/io5"
import {IdDroppedItem} from "../helpers/dragAndDrop";

const Container = styled.section`
  display: flex;
  flex-direction: column;
  width: 280px;
  background-color: ${props => props.theme.colors.darkGrey};
  padding: ${props => props.theme.spacing.big} 0;
`

const AddCollectionInput = styled.input`
  background: none;
  height: 40px;
  color: ${props => props.theme.colors.whiteAlternative};
  border: 0;
  outline: none;
  font-size: ${props => props.theme.fontSizes.medium}rem;
  padding: 0 ${props => props.theme.spacing.medium};
  margin-left: ${props => props.theme.spacing.big};
  margin-top: ${props => props.theme.spacing.medium};
`

const AddCollectionInputLabel = styled.label`
  left: -100vw;
  position: absolute;
`

const Separator = styled.hr`
  border: none;
  border-top: 1px solid ${props => props.theme.colors.grey};
  margin: ${props => props.theme.spacing.medium};
`

type Props = {
    mainCollections: TreeOutputCollection[]
    trashCollections?: TreeOutputCollection[],
    collectionsItems?: TreeCollectionItem[],
    onCollectionAdd?: (collectionName: string) => void,
    onCollectionRemove?: (collectionId: string, isDefinitiveDelete: boolean) => void,
    onTrashCollectionRemove?: (collectionId: string) => void
    selectedCollectionId?: string,
    onSelectedCollectionChange?: (collectionId: string) => void,
    afterCollectionFoldingChange?: (collectionId: string, isFolded: boolean) => void,
    onDropOnCollection?: (parentCollectionId: string, droppedItem: IdDroppedItem) => void,
    canDropOnCollection?: (parentCollectionId: string, droppedItem: IdDroppedItem) => boolean
}

export default function Sidebar({
                                    mainCollections,
                                    trashCollections,
                                    collectionsItems,
                                    onCollectionAdd,
                                    onCollectionRemove,
                                    selectedCollectionId,
                                    onSelectedCollectionChange,
                                    afterCollectionFoldingChange,
                                    onDropOnCollection,
                                    canDropOnCollection
                                }: Props) {
    const [newCollectionName, setNewCollectionName] = useState<string>("");

    function handleNewCollectionInputChange(e: ChangeEvent<HTMLInputElement>) {
        setNewCollectionName(e.target.value)
    }

    function handleNewCollectionInputKeyPress(e: KeyboardEvent) {
        if (e.key === 'Enter') {
            onCollectionAdd && onCollectionAdd(newCollectionName)
            setNewCollectionName("")
        }
    }

    function handleMenuItemClick(menuItemId: string, collectionId: string) {
        if (menuItemId === "Remove") {
            onCollectionRemove && onCollectionRemove(collectionId, false)
        }
    }

    function handleTrashMenuItemClick(menuItemId: string, collectionId: string) {
        if (menuItemId === "Delete") {
            onCollectionRemove && onCollectionRemove(collectionId, true)
        }
    }

    const trashMenuItems = ["Delete"]
    const menuItems = ["Remove"]

    const allCollectionsItemsCount = collectionsItems?.filter(item => item.collection !== TopCollections.TRASH).length
    const withoutCollectionsItemsCount = collectionsItems?.filter(item => item.collection === TopCollections.MAIN).length
    const trashCollectionsItemsCount = collectionsItems?.filter(item => item.collection === TopCollections.TRASH).length

    return <Container>
        <CollectionsTree onCollectionClick={onSelectedCollectionChange} selectedCollectionId={selectedCollectionId}>
            <CollectionTreeItem collectionId={VirtualCollections.ALL} name="All" icon={MdAllInbox}
                                count={allCollectionsItemsCount}/>
            <CollectionTreeItem collectionId={TopCollections.MAIN} name="Without collection"
                                icon={IoAlbums} count={withoutCollectionsItemsCount} onDrop={onDropOnCollection}
                                canDrop={canDropOnCollection}/>
            <CollectionTreeItem collectionId={TopCollections.TRASH} name="Trash" icon={IoTrash}
                                isDefaultFolded={true} count={trashCollectionsItemsCount} canDrop={canDropOnCollection}
                                onDrop={onDropOnCollection}>
                <CollectionsTree collections={trashCollections} selectedCollectionId={selectedCollectionId}
                                 onCollectionClick={onSelectedCollectionChange}
                                 menuItems={trashMenuItems}
                                 onMenuItemClick={handleTrashMenuItemClick}
                                 afterCollectionFoldingChange={afterCollectionFoldingChange}
                />
            </CollectionTreeItem>
        </CollectionsTree>
        <Separator/>
        <CollectionsTree collections={mainCollections}
                         selectedCollectionId={selectedCollectionId}
                         onCollectionClick={onSelectedCollectionChange}
                         afterCollectionFoldingChange={afterCollectionFoldingChange}
                         menuItems={menuItems}
                         onMenuItemClick={handleMenuItemClick}
                         onDrop={onDropOnCollection}
                         canDrop={canDropOnCollection}
        />
        <AddCollectionInputLabel htmlFor="add-collection-input">New collection...</AddCollectionInputLabel>
        <AddCollectionInput id="add-collection-input" onChange={handleNewCollectionInputChange}
                            value={newCollectionName}
                            type="text"
                            placeholder="New collection..." onKeyPress={handleNewCollectionInputKeyPress}/>
    </Container>
}