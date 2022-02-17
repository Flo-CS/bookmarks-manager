import React from "react";
import styled from "styled-components";

const Container = styled.div`
  height: 25px;
  display: inline-flex;
  align-items: center;
  color: ${props => props.theme.colors.whiteAlternative};

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
    folderId?: string,
    onClick?: (folderId: string | null) => void
}

export default function FolderName({name, icon: Icon, onClick, folderId}: Props) {
    function handleClick() {
        onClick && onClick(folderId || null)
    }

    return <Container onClick={handleClick} role={onClick && "button"}>
        {Icon && <Icon data-testid="icon"/>}
        <Name>{name}</Name>
    </Container>
}