import React, {ChangeEvent, KeyboardEvent, useState} from "react"
import styled from "styled-components";
import CollectionsTree, {TreeCollection} from "./CollectionsTree";
import CollectionTreeItem from "./CollectionTreeItem";
import {TopCollections, VirtualCollections} from "../../utils/collections";

import {MdAllInbox} from "react-icons/md";
import {IoAlbums, IoTrash} from "react-icons/io5"
import {IdDroppedItem} from "../../types/dragAndDrop";

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

export interface TreeCollectionItem {
    collection: string
}

interface Props {
    mainCollections: TreeCollection[]
    trashCollections?: TreeCollection[]
    collectionsItems?: TreeCollectionItem[]
    onCollectionAdd?: (collectionName: string) => void
    onCollectionRemove?: (collectionId: string, isDefinitiveDelete: boolean) => void
    onCollectionRename?: (newName: string, collectionId: string) => void
    onTrashCollectionRemove?: (collectionId: string) => void
    selectedCollectionId?: string
    onSelectedCollectionChange?: (collectionId: string) => void
    afterCollectionFoldingChange?: (collectionId: string, isFolded: boolean) => void
    onDropOnCollection?: (parentCollectionId: string, droppedItem: IdDroppedItem) => void
    canDropOnCollection?: (parentCollectionId: string, droppedItem: IdDroppedItem) => boolean
}

export default function Sidebar({
                                    mainCollections,
                                    trashCollections,
                                    collectionsItems,
                                    onCollectionAdd = () => undefined,
                                    onCollectionRemove = () => undefined,
                                    onCollectionRename = () => undefined,
                                    selectedCollectionId,
                                    onSelectedCollectionChange = () => undefined,
                                    afterCollectionFoldingChange = () => undefined,
                                    onDropOnCollection = () => undefined,
                                    canDropOnCollection
                                }: Props) {
    const [newCollectionName, setNewCollectionName] = useState<string>("");
    const [nameEditedCollectionId, setNameEditedCollectionId] = useState<string | undefined>(undefined);

    function handleNewCollectionInputChange(e: ChangeEvent<HTMLInputElement>) {
        setNewCollectionName(e.target.value)
    }

    function handleNewCollectionInputKeyPress(e: KeyboardEvent) {
        if (e.key === 'Enter') {
            onCollectionAdd(newCollectionName)
            setNewCollectionName("")
        }
    }

    function handleMenuItemClick(menuItemId: string, collectionId: string) {
        if (menuItemId === "Remove") {
            onCollectionRemove(collectionId, false)
        } else if (menuItemId === "Rename") {
            setNameEditedCollectionId(collectionId)
        }
    }

    function handleTrashMenuItemClick(menuItemId: string, collectionId: string) {
        if (menuItemId === "Delete") {
            onCollectionRemove(collectionId, true)
        }
    }

    function handleAfterCollectionNameChange(newName: string, collectionId?: string) {
        if (collectionId) {
            onCollectionRename(newName, collectionId)
            setNameEditedCollectionId(undefined)
        }
    }

    const trashMenuItems = ["Delete"]
    const menuItems = ["Remove", "Rename"]

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
                         nameEditedCollectionId={nameEditedCollectionId}
                         afterCollectionNameChange={handleAfterCollectionNameChange}
        />
        <AddCollectionInputLabel htmlFor="add-collection-input">New collection...</AddCollectionInputLabel>
        <AddCollectionInput id="add-collection-input" onChange={handleNewCollectionInputChange}
                            value={newCollectionName}
                            type="text"
                            placeholder="New collection..." onKeyPress={handleNewCollectionInputKeyPress}/>
    </Container>
}