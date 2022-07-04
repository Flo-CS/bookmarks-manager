import React from "react";
import styled from "styled-components";

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

type Props = {
    name: string,
    icon?: React.ComponentType,
    collectionId?: string,
    onClick?: (collectionId: string | null) => void
}

export default function CollectionName({name, icon: Icon, onClick, collectionId}: Props) {
    function handleClick() {
        onClick && onClick(collectionId || null)
    }

    return <Container onClick={handleClick} role={onClick && "button"}>
        {Icon && <Icon data-testid="icon"/>}
        <Name>{name}</Name>
    </Container>
}