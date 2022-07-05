import React, {useMemo, useState} from "react";
import CollectionName from "./CollectionName";
import {MdArrowDropDown, MdArrowRight} from "react-icons/md";
import styled, {css} from "styled-components";
import Menu from "./Menu";
import useMenu from "../hooks/useMenu";
import {useDrag, useDrop} from "react-dnd";
import {IdDragItem, IdDroppedItem} from "../../types/dragAndDrop";
import CollectionTreeSeparatorItem from "./CollectionTreeSeparatorItem";
import {DndTypes} from "../../utils/dragAndDrop";


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

export interface CollectionTreeItemProps {
    collectionId: string
    parentCollectionId?: string
    index?: number
    isDefaultFolded?: boolean
    count?: number
    name: string
    icon?: React.ComponentType
    onClick?: (collectionId: string) => void
    isSelected?: boolean
    afterFoldingChange?: (collectionId: string, isFolded: boolean) => void
    children?: React.ReactNode
    menuItems?: string[]
    onMenuItemClick?: (menuItemId: string, collectionId: string) => void
    onDrop?: (parentCollectionId: string, droppedItem: IdDroppedItem) => void
    canDrop?: (parentCollectionId: string, droppedItem: IdDroppedItem) => boolean
    isCollectionNameEdited?: boolean
    afterCollectionNameChange?: (newName: string, collectionId?: string) => void
}

interface DragCollectedProps {
    isDragging: boolean
}


interface DropCollectedProps {
    isDroppingHover: boolean
}


export default function CollectionTreeItem({
                                               collectionId,
                                               parentCollectionId,
                                               index,
                                               isDefaultFolded,
                                               count,
                                               name,
                                               icon,
                                               onClick,
                                               menuItems,
                                               onMenuItemClick,
                                               isSelected,
                                               afterFoldingChange,
                                               children,
                                               onDrop,
                                               canDrop,
                                               isCollectionNameEdited,
                                               afterCollectionNameChange
                                           }: CollectionTreeItemProps): JSX.Element {
    const [isFolded, setIsFolded] = useState<boolean>(!!isDefaultFolded);
    const [menuStatus, openMenu, closeMenu] = useMenu();

    const [{isDragging}, drag] = useDrag<IdDragItem, void, DragCollectedProps>({
        type: DndTypes.COLLECTION_ITEM,
        item: {
            id: collectionId
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    })
    const [{isDroppingHover}, drop] = useDrop<IdDragItem, void, DropCollectedProps>({
        accept: [DndTypes.COLLECTION_ITEM, DndTypes.BOOKMARK_CARD],
        drop: (item, monitor) => {
            if (!monitor.getItemType()) return;
            onDrop && onDrop(collectionId, {id: item.id, type: monitor.getItemType() as DndTypes, index: 0})
        },
        canDrop: (item, monitor) => {
            if (!canDrop || !monitor.getItemType()) return false
            return canDrop(collectionId, {id: item.id, type: monitor.getItemType() as DndTypes, index: 0})
        },
        collect: (monitor) => ({
            isDroppingHover: monitor.isOver({shallow: true}) && monitor.canDrop()
        }),
    })


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

    function handleMenuItemClick(menuItemId: string) {
        onMenuItemClick && onMenuItemClick(menuItemId, collectionId)
        closeMenu()
    }

    const hasToShowFoldButton = React.Children.count(children) !== 0
    const hasToShowCount = count !== undefined
    const hasToShowTreeSeparatorItem = parentCollectionId !== undefined && index !== undefined

    const menuItemsComponents = useMemo(() => menuItems?.map((item) => {
        return <Menu.Item key={item} id={item}
                          onClick={() => handleMenuItemClick(item)}>{item}</Menu.Item>
    }), [menuItems])

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
                    {isFolded ? <MdArrowRight/> : <MdArrowDropDown/>}
                </FoldButton>
            }
            <CollectionName
                name={name}
                icon={icon}
                afterNameChange={afterCollectionNameChange}
                collectionId={collectionId}
                isInEditMode={isCollectionNameEdited}/>
            {hasToShowCount &&
                <Count>
                    {count}
                </Count>
            }
            <Menu position={menuStatus.position} onClose={closeMenu} isShow={menuStatus.isOpened}>
                {menuItemsComponents}
            </Menu>
        </Container>
        {!isFolded && children}
        {hasToShowTreeSeparatorItem &&
            <CollectionTreeSeparatorItem parentCollectionId={parentCollectionId!}
                                         index={index!}
                                         onDrop={onDrop}
                                         canDrop={canDrop}/>
        }
    </Wrapper>
}
