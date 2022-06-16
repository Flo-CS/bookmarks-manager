import React, {ChangeEvent, KeyboardEvent, useState} from "react"
import styled from "styled-components";
import CollectionsTree, {TreeCollectionData} from "./CollectionsTree";
import CollectionTreeItem from "./CollectionTreeItem";
import {SpecialsCollections} from "../helpers/collections";

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
    collections: {
        main: TreeCollectionData[],
        trash?: TreeCollectionData[]
    },
    onCollectionAdd?: (collectionName: string) => void,
    selectedCollectionId?: string,
    onSelectedCollectionChange?: (collectionId: string) => void,
    afterCollectionFoldingChange?: (collectionId: string, isFolded: boolean) => void
}

export default function Sidebar({
                                    collections,
                                    onCollectionAdd,
                                    selectedCollectionId,
                                    onSelectedCollectionChange,
                                    afterCollectionFoldingChange
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

    function handleCollectionClick(collectionId: string) {
        onSelectedCollectionChange && onSelectedCollectionChange(collectionId)
    }

    return <Container>
        <CollectionsTree onCollectionClick={handleCollectionClick} selectedCollectionId={selectedCollectionId}>
            <CollectionTreeItem collectionId={SpecialsCollections.ALL} name="All" icon={MdAllInbox}/>
            <CollectionTreeItem collectionId={SpecialsCollections.WITHOUT_COLLECTION} name="Without collection"
                                icon={IoAlbums}/>
            <CollectionTreeItem collectionId={SpecialsCollections.TRASH} name="Trash" icon={IoTrash}>
                <CollectionsTree collections={collections.trash} selectedCollectionId={selectedCollectionId}
                                 onCollectionClick={handleCollectionClick}/>
            </CollectionTreeItem>
        </CollectionsTree>
        <Separator/>
        <CollectionsTree collections={collections.main}
                         selectedCollectionId={selectedCollectionId}
                         onCollectionClick={handleCollectionClick}
                         afterCollectionFoldingChange={afterCollectionFoldingChange}/>
        <AddCollectionInputLabel htmlFor="add-collection-input">New collection...</AddCollectionInputLabel>
        <AddCollectionInput id="add-collection-input" onChange={handleNewCollectionInputChange}
                            value={newCollectionName}
                            type="text"
                            placeholder="New collection..." onKeyPress={handleNewCollectionInputKeyPress}/>
    </Container>
}