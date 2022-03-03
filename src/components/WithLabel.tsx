import styled from "styled-components";
import React, {useState} from "react";
import uniqueId from "lodash/uniqueId";

const Container = styled.div<Pick<Props, "direction">>`
  display: flex;
  flex-direction: ${props => props.direction === "vertical" ? "column" : "row"};
  color: ${props => props.theme.colors.white};
  align-items: ${props => props.direction !== "vertical" && "center"};
`

const Label = styled.label`
  margin-bottom: ${props => props.theme.spacing.small};
  margin-right: ${props => props.theme.spacing.small};
`

type Props = {
    direction?: "vertical" | "horizontal",
    label?: string
}

export default function WithLabel<P>(Component: React.ComponentType<P>) {
    return ({direction, label, ...props}: P & Props) => {
        const [id] = useState(uniqueId('input-'))

        return <Container direction={direction}>
            {label && <Label htmlFor={id}>{label}</Label>}
            <Component id={id} {...props as P} />
        </Container>
    }
}
