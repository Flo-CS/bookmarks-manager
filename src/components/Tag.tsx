import React from "react";
import styled from "styled-components";

import {MdClose} from "react-icons/md";


const Container = styled.div`
  color: ${props => props.theme.colors.white};
  font-size: ${props => props.theme.fontSizes.small}rem;
  background-color: ${props => props.theme.colors.accent1};
  height: 30px;
  display: inline-flex;
  align-items: center;
  padding: 0 10px;
  border-radius: 5px;
  cursor: pointer;

  &.accent2 {
    background-color: ${props => props.theme.colors.accent2};
  }
  
  &.little {
    height: 20px;
    font-size: ${props => props.theme.fontSizes.verySmall}rem;
  }
`

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border: none;
  margin-left: 0.5em;
  cursor: pointer;

  & > svg {
    color: ${props => props.theme.colors.white}
  }
`

type Props = {
    onClose?: () => void;
    onClick?: () => void;
    children?: string;
    size?: "normal" | "little";
    color?: "accent1" | "accent2"
}

export default function Tag({onClose, onClick, children, color, size}: Props) {
    function handleClick() {
        if (onClick) onClick()
    }

    function handleClose(e: React.SyntheticEvent) {
        e.stopPropagation()
        if (onClose) onClose()
    }

    return <Container onClick={handleClick} className={`${color} ${size}`}>
        {children}
        {onClose && <CloseButton onClick={handleClose} aria-label="close"><MdClose/></CloseButton>}
    </Container>
}

Tag.defaultProps = {
    size: "normal",
    color: "accent1"
} as Partial<Props>