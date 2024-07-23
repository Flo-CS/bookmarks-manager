import React, { useMemo, useRef } from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import styled from "styled-components";
import WithLabel from "./WithLabel";

const Input = styled(ContentEditable)`
  background-color: ${props => props.theme.colors.darkGrey};
  border: none;
  border-radius: ${props => props.theme.radius.small};
  color: ${props => props.theme.colors.whiteAlternative};
  outline: none;
  font-size: ${props => props.theme.fontSizes.small}em;
  width: 100%;
  height: 40px;
  padding: ${props => props.theme.spacing.medium} ${props => props.theme.spacing.medium};

  &[data-text="true"] {
    background-color: ${props => props.theme.colors.accent2};
  }
`

interface Props {
    highlights?: string[]
    value: string
    onChange?: (newValue: string) => void
}

export function HighlightTextInput({ highlights = [], value, onChange = () => undefined }: Props) {
    const test = useRef(null)
    console.log(test);

    function handleChange(e: ContentEditableEvent) {
        onChange(e.target.value)
    }

    let highlightedValue = value;
    highlights.forEach(highlight => {
        highlightedValue = highlightedValue.replace(highlight, `<span data-text="true">$&</span>`)
    })

    return <Input onChange={handleChange} html={highlightedValue} innerRef={test} />
}

export default WithLabel(HighlightTextInput);