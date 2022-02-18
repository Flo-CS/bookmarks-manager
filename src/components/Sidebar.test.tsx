import {render} from "../../tests/utilities";
import {fireEvent, screen} from "@testing-library/react";
import React from "react";
import {folders} from "../../tests/mockData";
import Sidebar from "./Sidebar";
import {SpecialFolders} from "../helpers/folders";

describe("Sidebar component", () => {
    it("calls onFolderAdded with folder name", () => {
        const onFolderAddedMock = jest.fn()

        render(<Sidebar folders={{main: folders}} onFolderAdd={onFolderAddedMock}/>)

        const input = screen.getByLabelText("New folder...")

        fireEvent.change(input, {
            target: {
                value: "aNewFolderName"
            }
        })
        fireEvent.keyPress(input, {key: 'Enter', code: 'Enter', charCode: 13})

        expect(onFolderAddedMock).toHaveBeenCalledTimes(1);
        expect(onFolderAddedMock).toHaveBeenCalledWith("aNewFolderName");
    })
    it("clears input when folder added", () => {
        render(<Sidebar folders={{main: folders}}/>)

        const input = screen.getByLabelText("New folder...")

        fireEvent.change(input, {
            target: {
                value: "aNewFolderName"
            }
        })
        expect(input).toHaveValue("aNewFolderName")

        fireEvent.keyPress(input, {key: 'Enter', code: 'Enter', charCode: 13})

        expect(input).toHaveValue("")
    })
    it("handles folder selection", () => {
        const onFolderSelectMock = jest.fn();

        render(<Sidebar folders={{main: folders}} onSelectedFolderChange={onFolderSelectMock}/>)

        fireEvent.click(screen.getByText("All",))
        expect(onFolderSelectMock).toHaveBeenCalledWith(SpecialFolders.ALL)
        expect(onFolderSelectMock).toHaveBeenCalledTimes(1)
        fireEvent.click(screen.getByText("Trash"))
        expect(onFolderSelectMock).toHaveBeenCalledWith(SpecialFolders.TRASH)
        expect(onFolderSelectMock).toHaveBeenCalledTimes(2)
        fireEvent.click(screen.getByText("121", {exact: true}))
        expect(onFolderSelectMock).toHaveBeenCalledWith("121")
        expect(onFolderSelectMock).toHaveBeenCalledTimes(3)
    })
})