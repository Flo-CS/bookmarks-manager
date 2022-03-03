import React, {useState} from "react";
import uniqueId from "lodash/uniqueId";
import styled, {css} from "styled-components";


const Container = styled.div<Pick<Props, "direction">>`
  display: flex;
  flex-direction: ${props => props.direction === "vertical" ? "column" : "row"};
  color: ${props => props.theme.colors.white};
  align-items: ${props => props.direction === "horizontal" && "center"};
`

const Label = styled.label`
  margin-bottom: ${props => props.theme.spacing.small};
  margin-right: ${props => props.theme.spacing.small};
`

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

type Props =
    {
        label?: string,
        isMultiline?: boolean,
        direction?: "vertical" | "horizontal",
    }
    & React.HTMLAttributes<HTMLInputElement>
    & React.HTMLAttributes<HTMLTextAreaElement>

export default function TextInput({label, isMultiline, direction, ...props}: Props) {
    const [id] = useState(uniqueId('input-'))
    return <Container direction={direction}>
        {label && <Label htmlFor={id}>{label}</Label>}
        {isMultiline ? <TextArea name={label} id={id} rows={4} {...props}/> :
            <Input type="text" name={label} id={id} {...props}/>}
    </Container>
}