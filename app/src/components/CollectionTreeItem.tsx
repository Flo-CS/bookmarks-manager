import React, { useState } from "react";
import CollectionName from "./CollectionName";
import { MdArrowDropDown, MdArrowRight } from "react-icons/md";
import styled, { css } from "styled-components";
import useMenu from "../hooks/useMenu";
import { useDrag, useDrop } from "react-dnd";
import { IdDragItem, IdDroppedItem } from "../../types/dragAndDrop";
import { DndItems } from "../../utils/dragAndDrop";


const Wrapper = styled.div<{ isSelected: boolean }>`
  position: relative;

  & & {
    margin-left: ${props => props.theme.spacing.large};
  }

  ${props => css`
    ${props.isSelected &&
        css`&::before {
      z-index: 0;
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      display: block;
      background-color: ${props.theme.colors.accent1};
      border-radius: ${props.theme.radius.small};
      height: 35px;
      width: 100%;
    }`
        }`
    }`

const Container = styled.div<{ isDragging: boolean, isDropping: boolean }>`
  height: 35px;
  width: 100%;
  padding: 0 ${props => props.theme.spacing.big};
  display: inline-flex;
  align-items: center;
  cursor: pointer;

  ${props => css`
    opacity: ${props.isDragging ? 0.2 : 1};

    ${props.isDropping &&
        css`border: dashed 2px ${props.theme.colors.lightGrey};`
        };
  `
    }
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


export interface CollectionsTreeRightMenuRenderProps {
    position: {
        x: number
        y: number
    },
    isOpened: boolean,
    closeMenu: () => void,
    collectionId: string,
}

export interface CollectionTreeItemProps {
    collectionId: string
    isDefaultFolded?: boolean
    count?: number
    name: string
    icon?: React.ComponentType
    onClick?: (collectionId: string) => void
    isSelected?: boolean
    afterFoldingChange?: (collectionId: string, isFolded: boolean) => void
    onDrop?: (parentCollectionId: string, droppedItem: IdDroppedItem) => void
    canDrop?: (parentCollectionId: string, droppedItem: IdDroppedItem) => boolean
    isCollectionNameEdited?: boolean
    afterCollectionNameChange?: (newName: string, collectionId: string) => void,
    dropSeparator?: React.ReactNode,
    rightMenu?: (props: CollectionsTreeRightMenuRenderProps) => React.ReactNode,
    children?: React.ReactNode
}


interface DragCollectedProps {
    isDragging: boolean
}

interface DropCollectedProps {
    isDroppingHover: boolean
}

export default function CollectionTreeItem({
    collectionId,
    isDefaultFolded,
    count,
    name,
    icon,
    onClick = () => undefined,
    isSelected,
    afterFoldingChange = () => undefined,
    onDrop = () => undefined,
    canDrop = () => false,
    isCollectionNameEdited,
    afterCollectionNameChange = () => undefined,
    dropSeparator,
    rightMenu = () => undefined,
    children,
}: CollectionTreeItemProps): JSX.Element {
    const [isFolded, setIsFolded] = useState<boolean>(!!isDefaultFolded);
    const [menuStatus, openMenu, closeMenu] = useMenu();

    const [{ isDragging }, drag] = useDrag<IdDragItem, void, DragCollectedProps>({
        type: DndItems.COLLECTION,
        item: {
            id: collectionId
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    })
    const [{ isDroppingHover }, drop] = useDrop<IdDragItem, void, DropCollectedProps>({
        accept: [DndItems.COLLECTION, DndItems.BOOKMARK],
        drop: (item, monitor) => {
            if (!monitor.getItemType()) return;
            onDrop(collectionId, { id: item.id, type: monitor.getItemType() as DndItems, index: 0 })
        },
        canDrop: (item, monitor) => {
            if (!monitor.getItemType()) return false
            return canDrop(collectionId, { id: item.id, type: monitor.getItemType() as DndItems, index: 0 })
        },
        collect: (monitor) => ({
            isDroppingHover: monitor.isOver({ shallow: true }) && monitor.canDrop()
        }),
    })


    function handleFoldButtonClick(e: React.SyntheticEvent) {
        e.stopPropagation();
        setIsFolded((isFolded) => {
            afterFoldingChange(collectionId, !isFolded)
            return !isFolded
        })
    }

    function handleItemClick() {
        onClick(collectionId);
    }

    function handleRightItemClick(e: React.MouseEvent) {
        openMenu(e.clientX, e.clientY)
    }

    const hasToShowFoldButton = React.Children.count(children) !== 0
    const hasToShowCount = count !== undefined

    return <Wrapper isSelected={!!isSelected}
        data-testid={`collection-wrapper-${collectionId}`}
        onContextMenu={handleRightItemClick}>
        <Container onClick={handleItemClick}
            role="button"
            aria-label="click collection tree item"
            ref={(ref) => drag(drop(ref))}
            isDragging={isDragging}
            isDropping={isDroppingHover}>
            {hasToShowFoldButton &&
                <FoldButton onClick={handleFoldButtonClick} aria-label="toggle children folding">
                    {isFolded ? <MdArrowRight /> : <MdArrowDropDown />}
                </FoldButton>
            }
            <CollectionName
                name={name}
                icon={icon}
                afterNameChange={afterCollectionNameChange}
                collectionId={collectionId}
                isInEditMode={isCollectionNameEdited} />
            {hasToShowCount && <Count>{count}</Count>}
            {rightMenu({ ...menuStatus, closeMenu, collectionId })}
        </Container>
        {!isFolded && children}
        {dropSeparator}
    </Wrapper>
}
