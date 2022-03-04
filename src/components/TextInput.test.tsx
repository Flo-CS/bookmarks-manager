import {render} from "../../tests/utilities";
import {fireEvent, screen} from "@testing-library/react";
import TextInput from "./TextInput";

describe("LabelTextInput component", () => {

    it("handles multiline", () => {
        const {rerender, container} = render(<TextInput label="test" isMultiline={false}/>)

        expect(container.querySelector("input[type='text']")).toBeInTheDocument()
        expect(container.querySelector("textarea")).toBeNull()

        rerender(<TextInput label="test" isMultiline={true}/>)

        expect(container.querySelector("input[type='text']")).toBeNull()
        expect(container.querySelector("textarea")).toBeInTheDocument()
    })
    it("calls onChange", () => {
        const mockHandleChange = jest.fn()

        render(<TextInput label="test" isMultiline={false} onChange={mockHandleChange}/>)

        const input = screen.getByLabelText("test")

        fireEvent.change(input, {
            target: {
                value: "hello"
            }
        })

        expect(mockHandleChange).toHaveBeenCalledTimes(1)
        expect(mockHandleChange).toHaveBeenCalledWith("hello")

    })
})