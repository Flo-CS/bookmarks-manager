import React from "react";
import styled, {css} from "styled-components";
import {useDrop} from "react-dnd";
import {IdDragItem, IdDroppedItem} from "../../types/dragAndDrop";
import {DndTypes} from "../../utils/dragAndDrop";


const Separator = styled.div<{ isDropping: boolean }>`
  height: 5px;
  padding: 0;
  width: 100%;

  ${props => css`
    ${props.isDropping &&
    css`border: dashed 2px ${props.theme.colors.lightGrey};
      border-top: 0;`
    };
  `}
`

export type Props = {
    parentCollectionId: string,
    index: number,
    onDrop?: (parentCollectionId: string, droppedItem: IdDroppedItem) => void,
    canDrop?: (parentCollectionId: string, droppedItem: IdDroppedItem) => boolean
}

interface DropCollectedProps {
    isDroppingHover: boolean
}


export default function CollectionTreeSeparatorItem({
                                                        parentCollectionId,
                                                        index,
                                                        onDrop,
                                                        canDrop,
                                                    }: Props): JSX.Element {

    const [{isDroppingHover}, drop] = useDrop<IdDragItem, void, DropCollectedProps>({
        accept: [DndTypes.COLLECTION_ITEM],
        drop: (item, monitor) => {
            const itemType = monitor.getItemType() as DndTypes
            if (!itemType) return;
            onDrop && onDrop(parentCollectionId, {id: item.id, type: itemType, index: index})
        },
        canDrop: (item, monitor) => {
            const itemType = monitor.getItemType() as DndTypes
            if (!canDrop || !itemType) return false
            return canDrop(parentCollectionId, {id: item.id, type: itemType, index: index})
        },
        collect: (monitor) => ({
            isDroppingHover: monitor.isOver() && monitor.canDrop()
        }),
    })

    return <Separator isDropping={isDroppingHover} ref={drop}></Separator>
}
