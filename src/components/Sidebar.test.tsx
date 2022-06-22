import {render} from "../../tests/utilities";
import {fireEvent, screen} from "@testing-library/react";
import React from "react";
import {collections} from "../../tests/mockData";
import Sidebar from "./Sidebar";
import {SpecialsCollections} from "../helpers/collections";

describe("Sidebar component", () => {
    it("calls onCollectionAdded with collection name", () => {
        const onCollectionAddedMock = jest.fn()

        render(<Sidebar mainCollections={collections} onCollectionAdd={onCollectionAddedMock}/>)

        const input = screen.getByLabelText("New collection...")

        fireEvent.change(input, {
            target: {
                value: "aNewCollectionName"
            }
        })
        fireEvent.keyPress(input, {id: 'Enter', code: 'Enter', charCode: 13})

        expect(onCollectionAddedMock).toHaveBeenCalledTimes(1);
        expect(onCollectionAddedMock).toHaveBeenCalledWith("aNewCollectionName");
    })
    it("clears input when collection added", () => {
        render(<Sidebar mainCollections={collections}/>)

        const input = screen.getByLabelText("New collection...")

        fireEvent.change(input, {
            target: {
                value: "aNewCollectionName"
            }
        })
        expect(input).toHaveValue("aNewCollectionName")

        fireEvent.keyPress(input, {id: 'Enter', code: 'Enter', charCode: 13})

        expect(input).toHaveValue("")
    })
    it("handles collection selection", () => {
        const onCollectionSelectMock = jest.fn();

        render(<Sidebar mainCollections={collections} onSelectedCollectionChange={onCollectionSelectMock}/>)

        fireEvent.click(screen.getByText("All",))
        expect(onCollectionSelectMock).toHaveBeenCalledWith(SpecialsCollections.ALL)
        expect(onCollectionSelectMock).toHaveBeenCalledTimes(1)
        fireEvent.click(screen.getByText("Trash"))
        expect(onCollectionSelectMock).toHaveBeenCalledWith(SpecialsCollections.TRASH)
        expect(onCollectionSelectMock).toHaveBeenCalledTimes(2)
        fireEvent.click(screen.getByText("121", {exact: true}))
        expect(onCollectionSelectMock).toHaveBeenCalledWith("121")
        expect(onCollectionSelectMock).toHaveBeenCalledTimes(3)
    })
})