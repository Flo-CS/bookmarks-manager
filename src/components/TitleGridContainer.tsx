import styled from "styled-components";
import {ReactNode} from "react";

const Container = styled.section`
  padding: ${props => props.theme.spacing.medium};
`
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 500px), 1fr));
  grid-gap: ${props => props.theme.spacing.medium};
`

const ContainerTitle = styled.h2`
  font-size: ${props => props.theme.fontSizes.medium}rem;
  font-weight: normal;
  color: ${props => props.theme.colors.white};
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