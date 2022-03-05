import React from "react";
import styled from "styled-components";
import WithLabel from "./WithLabel";

const TextArea = styled.textarea`
  background-color: ${props => props.theme.colors.darkGrey};
  border: none;
  border-radius: ${props => props.theme.radius.small};
  color: ${props => props.theme.colors.whiteAlternative};
  outline: none;
  font-size: ${props => props.theme.fontSizes.small}em;
  width: 100%;
  padding: ${props => props.theme.spacing.medium};
  resize: none;
`

export function MultilineTextInput({...props}) {
    return <TextArea rows={4} {...props}/>
}

export default WithLabel(MultilineTextInput);
