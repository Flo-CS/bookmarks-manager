import React from "react"
import Modal from "react-modal"
import {BookmarkData} from "../helpers/bookmarks";


type Props = {
    isOpen: boolean,
    title?: string,
    onClose?: () => void,
    bookmarkData?: BookmarkData,
    onFetchBookmarkLink?: (url: string) => void,
    onBookmarkSave?: (data: BookmarkData) => void,
    isFetchingData?: boolean
}
export default function BookmarkModal({isOpen, onClose, title, bookmarkData, onFetchBookmarkLink, onBookmarkSave, isFetchingData}: Props) {
    return <Modal isOpen={isOpen} shouldCloseOnOverlayClick={true} onRequestClose={onClose}>

    </Modal>
}