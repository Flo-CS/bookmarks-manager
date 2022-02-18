import React, {ChangeEvent, KeyboardEvent, useState} from "react"
import {Folder} from "../@types/folder";
import styled from "styled-components";
import FoldersTree from "./FoldersTree";
import FolderTreeItem from "./FolderTreeItem";
import {SpecialFolders} from "../helpers/folders";

import {MdAllInbox} from "react-icons/md";
import {IoTrash, IoAlbums} from "react-icons/io5"

const Container = styled.section`
  display: flex;
  flex-direction: column;
  width: 280px;
  background-color: ${props => props.theme.colors.darkGrey};
  padding: ${props => props.theme.spacing.big} 0;
`

const AddFolderInput = styled.input`
  background: none;
  height: 40px;
  color: ${props => props.theme.colors.whiteAlternative};
  border: 0;
  outline: none;
  font-size: ${props => props.theme.fontSizes.medium}rem;
  padding: 0 ${props => props.theme.spacing.medium};
  margin-left: ${props => props.theme.spacing.big};
  margin-top: ${props => props.theme.spacing.medium};
`

const AddFolderInputLabel = styled.label`
  left: -100vw;
  position: absolute;
`

const Separator = styled.hr`
  border: none;
  border-top: 1px solid ${props => props.theme.colors.grey};
  margin: ${props => props.theme.spacing.medium};
`

type Props = {
    folders: {
        main: Folder[],
        trash?: Folder[]
    },
    onFolderAdd?: (folderName: string) => void,
    selectedFolderId?: string,
    onSelectedFolderChange?: (folderId: string) => void
}
export default function Sidebar({folders, onFolderAdd, selectedFolderId, onSelectedFolderChange}: Props) {
    const [newFolderName, setNewFolderName] = useState<string>("");

    function handleNewFolderInputChange(e: ChangeEvent<HTMLInputElement>) {
        setNewFolderName(e.target.value)
    }

    function handleNewFolderInputKeyPress(e: KeyboardEvent) {
        if (e.key === 'Enter') {
            onFolderAdd && onFolderAdd(newFolderName)
            setNewFolderName("")
        }
    }

    function handleFolderClick(folderId: string) {
        onSelectedFolderChange && onSelectedFolderChange(folderId)
    }

    return <Container>
        <FoldersTree onFolderClick={handleFolderClick} selectedFolderId={selectedFolderId}>
            <FolderTreeItem folderId={SpecialFolders.ALL} name="All" icon={MdAllInbox}/>
            <FolderTreeItem folderId={SpecialFolders.WITHOUT_FOLDER} name="Without folder" icon={IoAlbums}/>
            <FolderTreeItem folderId={SpecialFolders.TRASH} name="Trash" icon={IoTrash}>
                <FoldersTree folders={folders.trash} selectedFolderId={selectedFolderId}
                             onFolderClick={handleFolderClick}/>
            </FolderTreeItem>
        </FoldersTree>
        <Separator/>
        <FoldersTree folders={folders.main} selectedFolderId={selectedFolderId} onFolderClick={handleFolderClick}/>
        <AddFolderInputLabel htmlFor="add-folder-input">New folder...</AddFolderInputLabel>
        <AddFolderInput id="add-folder-input" onChange={handleNewFolderInputChange} value={newFolderName} type="text"
                        placeholder="New folder..." onKeyPress={handleNewFolderInputKeyPress}/>
    </Container>
}