export enum DndTypes {
    COLLECTION_ITEM = "COLLECTION_ITEM",
    BOOKMARK_CARD = "BOOKMARK_CARD"
}

export interface IdDragItem {
    id: string
}


export interface IdDroppedItem {
    type: DndTypes,
    id: string
}
