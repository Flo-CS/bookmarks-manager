import React from "react";
import styled from "styled-components";
import {MdArrowForwardIos} from "react-icons/md";

const Container = styled.div`
  display: inline-flex;
  align-items: center;
  color: ${props => props.theme.colors.whiteAlternative};
  
  & > svg {
    color: ${props => props.theme.colors.whiteAlternative};
  }
`

export default function FoldersBreadCrumb({children}: { children: React.ReactNode }) {
    return <Container>
        {React.Children.map(children, (child, index) => {
            return <>
                {child}
                {index !== React.Children.count(children) - 1 &&
                    <MdArrowForwardIos/> /* Don't show icon with last item */}
            </>
        })}
    </Container>
}