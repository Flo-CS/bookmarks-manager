import React, {useRef} from "react";
import styled, {css} from "styled-components"
import useClickOutside from "../hooks/useClickOutside";
import {buttonReset} from "../styles/utils";

const MenuContainer = styled.div<{ ref: React.RefObject<any>, left?: number, top?: number }>`
  position: fixed;
  z-index: 1000 !important;
  overflow: hidden;
  ${({theme}) => {
    return css`
      background-color: ${theme.colors.darkGrey};
      border-radius: ${theme.radius.medium};
    `
  }}

  ${({left, top}) => {
    return css`
      top: ${top}px;
      left: ${left}px;
    `
  }}
`

const MenuItemsContainer = styled.ul`
  display: flex;
  flex-direction: column;
  ${({theme}) => {
    return css`
      padding: ${theme.spacing.small};
    `
  }}
`

const MenuItemButton = styled.button`
  ${buttonReset};

  ${({theme}) => {
    return css`
      border-radius: ${theme.radius.small};
      padding: ${theme.spacing.small} ${theme.spacing.large};

      &:hover {
        background-color: ${theme.colors.accent1};
      }
    `
  }}

`

interface MenuProps {
    position: { x: number, y: number }
    onClose: () => void,
    isShow: boolean,
    children: React.ReactNode
}

export function Menu({onClose, isShow, children, position}: MenuProps) {
    const ref = useRef<HTMLDivElement>(null);

    function handleClickOutside() {
        onClose()
    }

    useClickOutside(ref, handleClickOutside)


    return <>{isShow && <MenuContainer ref={ref} left={position.x} top={position.y}>
        <MenuItemsContainer>
            {children}
        </MenuItemsContainer>
    </MenuContainer>}</>
}

interface MenuItemProps {
    onClick?: (id: string | number | symbol) => void,
    children: string,
    id: string | number | symbol
}

export function MenuItem({onClick, id, children}: MenuItemProps) {
    function handleClick() {
        onClick && onClick(id)
    }

    return <MenuItemButton onClick={handleClick}>
        {children}
    </MenuItemButton>
}

Menu.Item = MenuItem
export default Menu