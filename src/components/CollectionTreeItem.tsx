import React, {useState} from "react";
import CollectionName from "./CollectionName";
import {MdArrowDropDown, MdArrowRight} from "react-icons/md";
import styled, {css} from "styled-components";
import Menu from "./Menu";
import useMenu from "../hooks/useMenu";


const Wrapper = styled.div<{ isSelected: boolean }>`
  position: relative;

  & & {
    padding-left: ${props => props.theme.spacing.large};
  }

  ${props => {
    if (props.isSelected) {
      return css`
        &::before {
          z-index: 0;
          content: "";
          position: absolute;
          top: 0;
          right: 0;
          display: block;
          background-color: ${props => props.theme.colors.accent1};
          border-radius: ${props => props.theme.radius.small};
          height: 35px;
          width: 100%;
      `
    }
  }
  }`

const Container = styled.div`
  height: 35px;
  width: 100%;
  padding: 0 ${props => props.theme.spacing.big};
  display: inline-flex;
  align-items: center;
  cursor: pointer;

  & > * {
    z-index: 99;

  }
`


const FoldButton = styled.button`
  border: none;
  cursor: pointer;
  background: none;
  width: 25px;
  height: 25px;

  & > svg {
    color: ${props => props.theme.colors.whiteAlternative};
    width: 100%;
    height: 100%;

  }
`

const Count = styled.p`
  color: ${props => props.theme.colors.whiteAlternative};
  margin-left: auto;
`

export type CollectionTreeItemProps = {
    collectionId: string,
    isDefaultFolded?: boolean,
    count?: number,
    name: string
    icon?: React.ComponentType
    onClick?: (collectionId: string) => void,
    isSelected?: boolean,
    afterFoldingChange?: (collectionId: string, isFolded: boolean) => void,
    children?: React.ReactNode,
    menuItems?: string[],
    onMenuItemClick?: (menuItemId: string, collectionId: string) => void
}

export default function CollectionTreeItem({
                                               collectionId,
                                               isDefaultFolded,
                                               count,
                                               name,
                                               icon,
                                               onClick,
                                               menuItems,
                                               onMenuItemClick,
                                               isSelected,
                                               afterFoldingChange,
                                               children
                                           }: CollectionTreeItemProps): JSX.Element {
    const [isFolded, setIsFolded] = useState<boolean>(!!isDefaultFolded);
    const [menuStatus, openMenu, closeMenu] = useMenu();


    function handleFoldButtonClick(e: React.SyntheticEvent) {
        e.stopPropagation();
        setIsFolded((isFolded) => {
            afterFoldingChange && afterFoldingChange(collectionId, !isFolded)
            return !isFolded
        })
    }

    function handleItemClick() {
        onClick && onClick(collectionId);
    }

    function handleRightItemClick(e: React.MouseEvent) {
        openMenu(e.clientX, e.clientY)
    }

    function handleMenuClose() {
        closeMenu()
    }

    function handleMenuItemClick(menuItemId: string) {
        onMenuItemClick && onMenuItemClick(menuItemId, collectionId)
    }


    return <Wrapper isSelected={!!isSelected} data-testid={`collection-wrapper-${collectionId}`}
                    onContextMenu={handleRightItemClick}>
        <Container onClick={handleItemClick} role="button" aria-label="click collection tree item"
        >
            {React.Children.count(children) !== 0 &&
                <FoldButton onClick={handleFoldButtonClick} aria-label="toggle children folding">
                    {isFolded ? <MdArrowRight/> : <MdArrowDropDown/>}
                </FoldButton>}
            <CollectionName name={name} icon={icon}/>
            {count !== undefined && <Count>
                {count}
            </Count>}
            {menuItems && <Menu position={menuStatus.position} onClose={handleMenuClose} isShow={menuStatus.isOpened}>
                {menuItems.map((item) => {
                    return <Menu.Item key={item} id={item} onClick={() => handleMenuItemClick(item)}>{item}</Menu.Item>
                })
                }
            </Menu>}
        </Container>
        {!isFolded && children}
    </Wrapper>
}