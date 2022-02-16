import styled from "styled-components";
import {ReactNode} from "react";

const Container = styled.section`
  padding: ${props => props.theme.spacing.medium};
`
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 500px), 1fr)); // TODO: This works with min() function but it's not well supported by all browsers
  grid-gap: ${props => props.theme.spacing.medium};
`

const ContainerTitle = styled.h2`
  font-size: ${props => props.theme.fontSizes.medium}rem;
  font-weight: normal;
  color: ${props => props.theme.colors.whiteAlternative};
  margin: ${props => props.theme.spacing.medium};
  margin-top: 0;
`

export default function TitleGridContainer({title, children}: { title: string, children: ReactNode }) {
    return <Container>
        <ContainerTitle>{title}</ContainerTitle>
        <Grid>
            {children}
        </Grid>
    </Container>
}