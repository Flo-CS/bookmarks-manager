import React, {useState} from "react";
import FolderName from "./FolderName";
import {MdArrowDropDown, MdArrowRight} from "react-icons/md";
import styled, {css} from "styled-components";


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

export type FolderTreeItemProps = {
    folderId: string,
    name: string
    icon?: React.ComponentType,
    onClick?: (folderId: string) => void,
    isDefaultFolded?: boolean,
    children?: React.ReactNode,
    count?: number,
    isSelected?: boolean
}

export default function FolderTreeItem({
                                           folderId,
                                           name,
                                           icon,
                                           onClick,
                                           isDefaultFolded,
                                           children,
                                           count,
                                           isSelected
                                       }: FolderTreeItemProps) {
    const [isFolded, setIsFolded] = useState<boolean>(!!isDefaultFolded);

    function handleFoldButtonClick(e: React.SyntheticEvent) {
        e.stopPropagation();
        setIsFolded((isFolded) => !isFolded)
    }

    function handleItemClick() {
        onClick && onClick(folderId);
    }

    return <Wrapper isSelected={!!isSelected} data-testid={`folder-wrapper-${folderId}`}>
        <Container onClick={handleItemClick} role="button" aria-label="click folder tree item">
            {React.Children.count(children) !== 0 && <FoldButton onClick={handleFoldButtonClick} aria-label="toggle children folding">
                {isFolded ? <MdArrowRight/> : <MdArrowDropDown/>}
            </FoldButton>}
            <FolderName name={name} icon={icon}/>
            {count && <Count>
                {count}
            </Count>}
        </Container>
        {!isFolded && children}
    </Wrapper>
}