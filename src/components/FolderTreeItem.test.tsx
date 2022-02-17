import {render} from "../../tests/utilities";
import {fireEvent, screen} from "@testing-library/react";
import FolderTreeItem from "./FolderTreeItem";
import {theme} from "../styles/Theme";

describe("FolderTreeItem component", () => {
    const props = {
        name: "aFolderName",
        folderId: "ImAnId"
        // icon: () => <svg>Icon</svg>,
    }

    it("has folder name", () => {
        render(<FolderTreeItem {...props}/>)
        expect(screen.getByText("aFolderName")).toHaveTextContent(props.name)
    })
    it("has count if count in props", () => {
        render(<FolderTreeItem {...props} count={10}/>)
        expect(screen.getByText("10")).toBeInTheDocument();
    })
    it("doesn't have count if count not in props", () => {
        render(<FolderTreeItem {...props}/>)
        expect(screen.queryByRole("paragraph", {name: /folder items count/i})).not.toBeInTheDocument()
    })
    it("call onClick on folder item click", () => {
        const onClickMock = jest.fn()
        render(<FolderTreeItem {...props} onClick={onClickMock}/>)
        const folderItem = screen.getByText("aFolderName")
        fireEvent.click(folderItem)
        expect(onClickMock).toHaveBeenCalledTimes(1);
        expect(onClickMock).toHaveBeenCalledWith(props.folderId)
    })
    it("show toggle folding button if it has children", () => {
        render(<FolderTreeItem {...props}>
            <FolderTreeItem folderId="1" name="subFolderName"/>
            <FolderTreeItem folderId="2" name="subFolderName"/>
        </FolderTreeItem>)

        // As children doesn't have children, only one toggle folding button will be in the DOM
        const toggleFoldingButton = screen.queryByRole("button", {name: /toggle children folding/i})
        expect(toggleFoldingButton).toBeInTheDocument()
    })
    it("doesn't show toggle folding button if it doesn't have children", () => {
        render(<FolderTreeItem {...props}/>)

        const toggleFoldingButton = screen.queryByRole("button", {name: /toggle children folding/i})
        expect(toggleFoldingButton).not.toBeInTheDocument()
    })
    it("show children only if isUnfolded and toggle it", () => {
        render(<FolderTreeItem {...props} isDefaultFolded={true}>
            <FolderTreeItem folderId="1" name="subFolderName"/>
            <FolderTreeItem folderId="2" name="subFolderName"/>
        </FolderTreeItem>)

        const toggleFoldingButton = screen.getByRole("button", {name: /toggle children folding/i})
        screen.queryAllByText("subFolderName").forEach((elem) => {
            expect(elem).not.toBeVisible()
        })
        fireEvent.click(toggleFoldingButton)
        screen.queryAllByText("subFolderName").forEach((elem) => {
            expect(elem).toBeVisible()
        })
        fireEvent.click(toggleFoldingButton)
        screen.queryAllByText("subFolderName").forEach((elem) => {
            expect(elem).not.toBeVisible()
        })
    })
    // Note: Will no longer works because of the use of pseudo-element
    it.skip("change color if it is selected", () => {
        render(<>
                <FolderTreeItem folderId="1" name="1" isSelected={false}/>
                <FolderTreeItem folderId="2" name="2" isSelected={true}/>
            </>
        )
        const c1 = screen.getByText("1").closest("div[data-testid^='folder-wrapper']")
        const c2 = screen.getByText("2").closest("div[data-testid^='folder-wrapper']")

        expect(c1).toHaveStyle(`background-color: ${theme.colors.black}`)
        expect(c2).toHaveStyle(`background-color: ${theme.colors.accent1}`, )
    })
})