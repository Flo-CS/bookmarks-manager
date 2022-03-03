import {render} from "../../tests/utilities";
import {fireEvent, screen} from "@testing-library/react";
import TextInput from "./TextInput";

describe("LabelTextInput component", () => {
    it("renders label", () => {
        const {rerender} = render(<TextInput label="test"/>)

        const getLabel = () => {
            return screen.queryByText((content, element) => {
                return element?.tagName.toLowerCase() === 'label' && content === "test";
            })
        }

        expect(getLabel()).toBeInTheDocument()

        rerender(<TextInput/>)
        expect(getLabel()).toBeNull()
    })
    it("handles multiline", () => {
        const {rerender, container} = render(<TextInput label="test" isMultiline={false}/>)

        expect(container.querySelector("input[type='text']")).toBeInTheDocument()
        expect(container.querySelector("textarea")).toBeNull()

        rerender(<TextInput label="test" isMultiline={true}/>)

        expect(container.querySelector("input[type='text']")).toBeNull()
        expect(container.querySelector("textarea")).toBeInTheDocument()
    })
    it("pass others props to input or textarea element", () => {
        const mockHandleChange = jest.fn()

        const {rerender} = render(<TextInput label="test" isMultiline={false} data-an-attribute-not-in-props="attribute"
                                             onChange={mockHandleChange} />)

        const input = screen.getByLabelText("test")
        expect(input).toHaveAttribute("data-an-attribute-not-in-props", "attribute")

        fireEvent.change(input, {
            target: {
                value: "hello"
            }
        })

        expect(mockHandleChange).toHaveBeenCalledTimes(1)

        rerender(<TextInput label="test" isMultiline={true} data-an-attribute-not-in-props="attribute"
                            onChange={mockHandleChange}/>)

        const textarea = screen.getByLabelText("test")
        expect(textarea).toHaveAttribute("data-an-attribute-not-in-props", "attribute")

        fireEvent.change(textarea, {
            target: {
                value: "hello"
            }
        })

        expect(mockHandleChange).toHaveBeenCalledTimes(2)
    })
})