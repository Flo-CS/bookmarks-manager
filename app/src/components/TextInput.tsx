import React from "react";
import styled from "styled-components";
import WithLabel from "./WithLabel";

const Input = styled.input`
  background-color: ${props => props.theme.colors.darkGrey};
  border: none;
  border-radius: ${props => props.theme.radius.small};
  color: ${props => props.theme.colors.whiteAlternative};
  outline: none;
  font-size: ${props => props.theme.fontSizes.small}em;
  width: 100%;
  height: 40px;
  padding: ${props => props.theme.spacing.small} ${props => props.theme.spacing.medium};
`

export function TextInput({...props}) {
    return <Input type="text" {...props}/>
}

export default WithLabel(TextInput);