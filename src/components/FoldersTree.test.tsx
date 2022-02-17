import React from "react";
import FoldersTree from "./FoldersTree"
import FolderTreeItem from "./FolderTreeItem";
import {render} from "../../tests/utilities";
import {screen, within} from "@testing-library/react";
import {Folder} from "../@types/folder";


describe("FolderTreeView component", () => {
    const folders: Folder[] = [
        {
            id: "1",
            name: "1",
            icon: () => <svg>1</svg>,
            children: [
                {
                    id: "11",
                    name: "11",
                    icon: () => <svg>12</svg>,
                },
                {
                    id: "12",
                    name: "12",
                    children: [
                        {
                            id: "121",
                            name: "121"
                        },
                    ]
                },
            ]
        },
        {
            id: "2",
            name: "2",
            icon: () => <svg>2</svg>,
            children: [
                {
                    id: "21",
                    name: "21"
                },
            ]
        }]
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
})