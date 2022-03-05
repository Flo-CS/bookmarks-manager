import {render} from "../../tests/utilities";
import {TagsInput} from "./TagsInput";
import {fireEvent, screen, within} from "@testing-library/react";

describe("TagsInput component", () => {

    it("add tags on enter key press", () => {
        const mockOnChange = jest.fn()
        render(<TagsInput tags={["test1", "test2"]} onChange={mockOnChange}/>)
        const input = screen.getByRole("textbox")

        fireEvent.change(input, {
            target: {
                value: "   test3   " // Also expect that tag is trimmed
            }
        })

        fireEvent.keyDown(input, {key: "Enter", code: "Enter"})

        expect(mockOnChange).toHaveBeenCalledWith(["test1", "test2", "test3"], "test3")
        expect(mockOnChange).toHaveBeenCalledTimes(1)
        expect(input).toHaveDisplayValue("")

        // No text in input => don't add
        fireEvent.keyDown(input, {key: "Enter", code: "Enter"})
        expect(mockOnChange).toHaveBeenCalledTimes(1)
    })
    it("removes tags", () => {
        const mockOnChange = jest.fn()
        render(<TagsInput tags={["test1", "test2", "test3"]} onChange={mockOnChange}/>)

        const tagComponent = screen.getByText("test2")
        const parent = tagComponent.parentElement
        if (parent) {
            const closeButton = within(parent).getByRole("button")
            fireEvent.click(closeButton)
        }

        expect(mockOnChange).toHaveBeenCalledWith(["test1", "test3"], "test2")
        expect(mockOnChange).toHaveBeenCalledTimes(1)
    })
    it("removes last tag only if input is empty by pressing backspace", () => {
        const mockOnChange = jest.fn()
        render(<TagsInput tags={["test1", "test2", "test3"]} onChange={mockOnChange}/>)
        const input = screen.getByRole("textbox")

        // With text in input
        fireEvent.change(input, {
            target: {
                value: "test4"
            }
        })
        fireEvent.keyDown(input, {key: "Backspace", code: "Backspace"})

        expect(mockOnChange).not.toBeCalled()

        // Without text in input
        fireEvent.change(input, {
            target: {
                value: ""
            }
        })
        fireEvent.keyDown(input, {key: "Backspace", code: "Backspace"})
        expect(mockOnChange).toHaveBeenCalledTimes(1)
        expect(mockOnChange).toHaveBeenCalledWith(["test1", "test2"], "test3")
    })
    it("renders tags", () => {
        const tags = ["test1", "test2", "test3"]
        render(<TagsInput tags={tags}/>)
        for (const tag of tags) {
            expect(screen.queryByText(tag)).toBeInTheDocument()
        }
    })
    it("renders suggestions", () => {
        render(<TagsInput tags={["test1", "test2"]} tagsSuggestions={["test_111", "222_test", "test_222",]}/>)
        const input = screen.getByRole("textbox")

        fireEvent.change(input, {
            target: {
                value: "222"
            }
        })

        const suggestions = screen.getByTestId("suggestions")
        expect(suggestions).toBeInTheDocument()

        expect(within(suggestions).queryByText("test_111")).not.toBeInTheDocument();
        expect(within(suggestions).getAllByText(/222/)).toHaveLength(2);
    })
})