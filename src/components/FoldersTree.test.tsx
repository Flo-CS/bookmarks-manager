import React from "react";
import FoldersTree from "./FoldersTree"
import FolderTreeItem from "./FolderTreeItem";
import {render} from "../../tests/utilities";
import {cleanup, fireEvent, screen, within} from "@testing-library/react";
import {Folder} from "../@types/folder";
import {theme} from "../styles/Theme";
import {folders} from "../../tests/mockData";


describe("FolderTreeView component", () => {

    it("renders folders hierarchy correctly", () => {
        render(<FoldersTree folders={folders}/>)

        function mapFolders(folders: Folder[], parentElement?: HTMLElement) {
            folders.forEach((folder) => {

                let folderElem;
                if (parentElement) {
                    folderElem = within(parentElement).queryByTestId(`folder-wrapper-${folder.id}`)
                } else {
                    folderElem = screen.queryByTestId(`folder-wrapper-${folder.id}`)
                }

                expect(folderElem).toBeInTheDocument()

                if (folder.children && folderElem) {
                    mapFolders(folder.children, folderElem)
                }
            })

        }

        mapFolders(folders)
    })
    it("uses children if children in props", () => {
        render(<FoldersTree folders={folders}>
            <FolderTreeItem folderId="1" name="children1">
                <FolderTreeItem folderId="11" name="children11"/>
            </FolderTreeItem>
        </FoldersTree>)

        expect(screen.queryByText("children1")).toBeInTheDocument()
        expect(screen.queryByText("children11")).toBeInTheDocument()
    })
    it("handles folder click", () => {
        const onFolderClickMock = jest.fn();

        render(<FoldersTree folders={folders} onFolderClick={onFolderClickMock}/>)
        fireEvent.click(screen.getByText("1", {exact: true}))
        expect(onFolderClickMock).toHaveBeenCalledWith("1")
        expect(onFolderClickMock).toHaveBeenCalledTimes(1)
        fireEvent.click(screen.getByText("121", {exact: true}))
        expect(onFolderClickMock).toHaveBeenCalledWith("121")
        expect(onFolderClickMock).toHaveBeenCalledTimes(2)

        cleanup()
        render(<FoldersTree onFolderClick={onFolderClickMock}>
            <FolderTreeItem folderId="1" name="1"/>
        </FoldersTree>)
        fireEvent.click(screen.getByText("1", {exact: true}))
        expect(onFolderClickMock).toHaveBeenCalledWith("1")
        expect(onFolderClickMock).toHaveBeenCalledTimes(3)


    })
    // Note: Will no longer works because of the use of pseudo-element
    it.skip("selects the correct folder with the selectedFolderId in props", () => {
        render(<FoldersTree folders={folders} selectedFolderId="121"/>)
        expect(screen.queryByTestId("folder-wrapper-121")).toHaveStyle(`background-color: ${theme.colors.accent1}`) // TODO: Change this
    })
})