import {DndTypes} from "../utils/dragAndDrop";

export interface IdDragItem {
    id: string
}

export interface IdDroppedItem {
    type: DndTypes,
    id: string,
    index: number
}
