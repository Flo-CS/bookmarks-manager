import {DndTypes} from "../utils/dragAndDrop";
import {WithId, WithIndex} from "./helpersTypes";

export type IdDragItem = WithId

export interface IdDroppedItem extends WithId, WithIndex {
    type: DndTypes
}
