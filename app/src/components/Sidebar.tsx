import React, { ChangeEvent, KeyboardEvent, useState } from "react"
import styled from "styled-components";

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

interface Props {
    onCollectionAdd?: (collectionName: string) => void
    topChildren: React.ReactNode
    bottomChildren: React.ReactNode
}

export default function Sidebar({
    onCollectionAdd = () => undefined,
    topChildren,
    bottomChildren,
}: Props) {
    const [newCollectionName, setNewCollectionName] = useState<string>("");

    function handleNewCollectionInputChange(e: ChangeEvent<HTMLInputElement>) {
        setNewCollectionName(e.target.value)
    }

    function handleNewCollectionInputKeyPress(e: KeyboardEvent) {
        if (e.key === 'Enter') {
            onCollectionAdd(newCollectionName)
            setNewCollectionName("")
        }
    }

    return <Container>
        {topChildren}
        <Separator />
        {bottomChildren}
        <AddCollectionInputLabel htmlFor="add-collection-input">New collection...</AddCollectionInputLabel>
        <AddCollectionInput
            id="add-collection-input"
            type="text"
            placeholder="New collection..."
            value={newCollectionName}
            onChange={handleNewCollectionInputChange}
            onKeyPress={handleNewCollectionInputKeyPress} />
    </Container>
}