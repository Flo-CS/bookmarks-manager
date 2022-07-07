import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import useClickOutside from "../hooks/useClickOutside";

const Container = styled.div`
  height: 25px;
  display: inline-flex;
  align-items: center;
  color: ${props => props.theme.colors.white};

  & > svg {
    height: 20px;
    width: 20px;
  }

  &[role="button"] {
    cursor: pointer;
  }
`

const Name = styled.p`
  margin-left: 0.3em;
`

const NameInput = styled.input`
`

interface Props {
    name: string
    collectionId: string
    icon?: React.ComponentType
    onClick?: (collectionId: string) => void
    isInEditMode?: boolean
    afterNameChange?: (newName: string, collectionId: string) => void
}

export default function CollectionName({
    name,
    collectionId,
    icon: Icon,
    onClick = () => undefined,
    isInEditMode = false,
    afterNameChange = () => undefined
}: Props) {
    const [newName, setNewName] = useState(name);

    const inputRef = useRef<HTMLInputElement>(null);
    useClickOutside(inputRef, handleAfterNameChange)

    useEffect(() => {
        if (isInEditMode) {
            inputRef.current?.focus()
        }
    }, [inputRef, isInEditMode]);

    function handleClick() {
        onClick(collectionId)
    }

    function handleNameInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        setNewName(e.currentTarget.value)
    }

    function handleNameInputKeyDown(e: React.KeyboardEvent) {
        if (e.key === "Enter") {
            afterNameChange(newName, collectionId)
        }
    }

    function handleAfterNameChange() {
        afterNameChange(newName, collectionId)
    }

    return <Container onClick={handleClick} role="button">
        {Icon && <Icon data-testid="icon" />}
        {isInEditMode ?
            <NameInput onChange={handleNameInputChange} value={newName} onKeyDown={handleNameInputKeyDown}
                ref={inputRef} /> :
            <Name>{name}</Name>
        }
    </Container>
}