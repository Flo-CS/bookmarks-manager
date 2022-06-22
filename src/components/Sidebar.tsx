import React, {ChangeEvent, KeyboardEvent, useState} from "react"
import styled from "styled-components";
import CollectionsTree from "./CollectionsTree";
import CollectionTreeItem from "./CollectionTreeItem";
import {SpecialsCollections, TreeCollectionItem, TreeOutputCollection} from "../helpers/collections";

import {MdAllInbox} from "react-icons/md";
import {IoAlbums, IoTrash} from "react-icons/io5"

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
    afterCollectionFoldingChange?: (collectionId: string, isFolded: boolean) => void
}

export default function Sidebar({
                                    mainCollections,
                                    trashCollections,
                                    collectionsItems,
                                    onCollectionAdd,
                                    onCollectionRemove,
                                    selectedCollectionId,
                                    onSelectedCollectionChange,
                                    afterCollectionFoldingChange
                                }: Props): JSX.Element {
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

    function handleCollectionClick(collectionId: string) {
        onSelectedCollectionChange && onSelectedCollectionChange(collectionId)
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

    function handleAfterCollectionFoldingChange(collectionId: string, isFolded: boolean) {
        afterCollectionFoldingChange && afterCollectionFoldingChange(collectionId, isFolded)
    }

    const trashMenuItems = ["Delete"]
    const menuItems = ["Remove"]

    const allCollectionsItemsCount = collectionsItems?.filter(item => item.collection !== SpecialsCollections.TRASH).length
    const withoutCollectionsItemsCount = collectionsItems?.filter(item => item.collection === SpecialsCollections.WITHOUT_COLLECTION).length
    const trashCollectionsItemsCount = collectionsItems?.filter(item => item.collection === SpecialsCollections.TRASH).length

    return <Container>
        <CollectionsTree onCollectionClick={handleCollectionClick} selectedCollectionId={selectedCollectionId}>
            <CollectionTreeItem collectionId={SpecialsCollections.ALL} name="All" icon={MdAllInbox}
                                count={allCollectionsItemsCount}/>
            <CollectionTreeItem collectionId={SpecialsCollections.WITHOUT_COLLECTION} name="Without collection"
                                icon={IoAlbums} count={withoutCollectionsItemsCount}/>
            <CollectionTreeItem collectionId={SpecialsCollections.TRASH} name="Trash" icon={IoTrash}
                                isDefaultFolded={true} count={trashCollectionsItemsCount}>
                <CollectionsTree collections={trashCollections} selectedCollectionId={selectedCollectionId}
                                 onCollectionClick={handleCollectionClick}
                                 menuItems={trashMenuItems}
                                 onMenuItemClick={handleTrashMenuItemClick}
                                 afterCollectionFoldingChange={handleAfterCollectionFoldingChange}
                />
            </CollectionTreeItem>
        </CollectionsTree>
        <Separator/>
        <CollectionsTree collections={mainCollections}
                         selectedCollectionId={selectedCollectionId}
                         onCollectionClick={handleCollectionClick}
                         afterCollectionFoldingChange={handleAfterCollectionFoldingChange}
                         menuItems={menuItems}
                         onMenuItemClick={handleMenuItemClick}
        />
        <AddCollectionInputLabel htmlFor="add-collection-input">New collection...</AddCollectionInputLabel>
        <AddCollectionInput id="add-collection-input" onChange={handleNewCollectionInputChange}
                            value={newCollectionName}
                            type="text"
                            placeholder="New collection..." onKeyPress={handleNewCollectionInputKeyPress}/>
    </Container>
}