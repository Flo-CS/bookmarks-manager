import React from "react";
import styled, {css} from "styled-components";
import WithLabel from "./WithLabel";


const Inputs = css`
  background-color: ${props => props.theme.colors.darkGrey};
  border: none;
  border-radius: ${props => props.theme.radius.small};
  color: ${props => props.theme.colors.whiteAlternative};
  outline: none;
  font-size: ${props => props.theme.fontSizes.small}em;
  width: 100%;
`
const Input = styled.input`
  ${Inputs};
  height: 40px;
  padding: ${props => props.theme.spacing.small} ${props => props.theme.spacing.medium};

`

const TextArea = styled.textarea`
  ${Inputs};
  padding: ${props => props.theme.spacing.medium};
  resize: none;
`

type Props = {
    isMultiline?: boolean,
    id?: string,
    onChange?: (value: string) => void,
    value?: string
}

export function TextInput({isMultiline, id, onChange, value}: Props) {

    const commonProps = {
        id,
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange && onChange(e.target.value),
        value
    }
    return <>{isMultiline ? <TextArea rows={4} {...commonProps}/> :
        <Input type="text" {...commonProps}/>}</>
}

export default WithLabel(TextInput);