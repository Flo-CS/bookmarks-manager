import {render} from "../../tests/utilities";
import {cleanup, fireEvent, screen} from "@testing-library/react";
import FolderName from "./FolderName";

describe("FolderName component", () => {
    it("has a name", () => {
        render(<FolderName name="aFolderName"/>);
        expect(screen.queryByText("aFolderName")).toBeInTheDocument();
    })
    it("has a icon if icon in props", () => {
        render(<FolderName name="aFolderName" icon={(props) => <svg {...props}>Icon</svg>}/>);
        expect(screen.queryByTestId("icon")).toBeInTheDocument()
    })
    it("calls onClick on click with folderId", () => {
        const onClickMock = jest.fn()
        render(<FolderName name="aFolderName" folderId="aFolderId" onClick={onClickMock}/>)

        fireEvent.click(screen.getByText("aFolderName"))

        expect(onClickMock).toHaveBeenCalledWith("aFolderId")
        expect(onClickMock).toHaveBeenCalledTimes(1)

        cleanup()

        render(<FolderName name="aFolderName" onClick={onClickMock}/>)
        fireEvent.click(screen.getByText("aFolderName"))

        expect(onClickMock).toHaveBeenCalledWith(null)
        expect(onClickMock).toHaveBeenCalledTimes(2)
    })
    it("has button role if onClick prop", () => {
        const onClickMock = jest.fn()
        render(<FolderName name="aFolderName" folderId="aFolderId" onClick={onClickMock}/>)

        expect(screen.queryByRole("button")).toBeInTheDocument()
        cleanup()
        render(<FolderName name="aFolderName" folderId="aFolderId"/>)

        expect(screen.queryByRole("button")).not.toBeInTheDocument()

    })
})