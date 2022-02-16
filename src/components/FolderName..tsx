import React from "react";
import styled from "styled-components";

const Container = styled.div`
  height: 25px;
  display: inline-flex;
  align-items: center;
  & > svg {
    height: 20px;
    width: 20px;
  }
`

const Name = styled.p`
  margin-left: 0.3em;
`

type Props = {
    name: string,
    icon?: React.ComponentType
}

export default function FolderName({name, icon: Icon}: Props) {
    return <Container>
        {Icon && <Icon data-testid="icon"/>}
        <Name>{name}</Name>
    </Container>
}