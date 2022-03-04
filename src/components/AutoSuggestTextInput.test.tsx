import {render} from "../../tests/utilities";
import {AutoSuggestTextInput} from "./AutoSuggestTextInput";
import {fireEvent, screen} from "@testing-library/react";

describe("AutoSuggestTextInput component", () => {
    let suggestions: string[];
    beforeAll(() => {
        suggestions = ["test_111", "test_222", "test_333"]
    })
    it("handles keyboard arrow navigation in suggestion list", () => {
        render(<AutoSuggestTextInput suggestions={suggestions} value="test"/>)
        const input = screen.getByRole("textbox");

        // Arrow down * 3
        for (let i = 0; i < 3; i++) {
            fireEvent.keyDown(input, {key: 'ArrowDown', code: 'ArrowDown'})
        }
        expect(screen.getByTestId("selected-suggestion")).toHaveTextContent("test_333")

        // Arrow up * 3
        for (let i = 0; i < 3; i++) {
            fireEvent.keyDown(input, {key: 'ArrowUp', code: 'ArrowUp'})
        }
        expect(screen.getByTestId("selected-suggestion")).toHaveTextContent("test_333")

        // Arrow down * 2
        for (let i = 0; i < 2; i++) {
            fireEvent.keyDown(input, {key: 'ArrowDown', code: 'ArrowDown'})
        }
        expect(screen.getByTestId("selected-suggestion")).toHaveTextContent("test_222")

    })
    it("calls onChange and selects suggestion item on click", () => {
        const mockOnChange = jest.fn();
        render(<AutoSuggestTextInput suggestions={suggestions} value="test" onChange={mockOnChange}/>)

        fireEvent.click(screen.getByText("test_111"))

        expect(screen.getByTestId("selected-suggestion")).toHaveTextContent("test_111")
        expect(mockOnChange).toHaveBeenCalledWith("test_111");
        expect(mockOnChange).toHaveBeenCalledTimes(1);

        fireEvent.click(screen.getByText("test_333"))

        expect(screen.getByTestId("selected-suggestion")).toHaveTextContent("test_333")
        expect(mockOnChange).toHaveBeenCalledWith("test_333");
        expect(mockOnChange).toHaveBeenCalledTimes(2);

    })
    it("closes suggestion list on pressing escape", () => {
        render(<AutoSuggestTextInput suggestions={suggestions} value="test"/>)
        const input = screen.getByRole("textbox");

        expect(screen.queryByTestId("suggestions")).toBeInTheDocument()
        fireEvent.keyDown(input, {key: 'Escape', code: 'Escape'})
        expect(screen.queryByTestId("suggestions")).not.toBeInTheDocument()
    })
    it("calls onChange on text input", () => {
        const mockOnChange = jest.fn();
        render(<AutoSuggestTextInput suggestions={suggestions} value="test" onChange={mockOnChange}/>)

        const input = screen.getByRole("textbox");


        fireEvent.change(input, {
            target: {
                value: "hello"
            }
        })
        expect(mockOnChange).toHaveBeenCalledWith("hello");
        expect(mockOnChange).toHaveBeenCalledTimes(1);
    })
    it("calls onChange on 'enter' key press", () => {
        const mockOnChange = jest.fn();
        const {rerender} = render(<AutoSuggestTextInput suggestions={suggestions} value="test" onChange={mockOnChange}/>)
        const input = screen.getByRole("textbox");

        expect(screen.queryByTestId("selected-suggestion")).not.toBeInTheDocument()
        fireEvent.keyDown(input, {key: 'Enter', code: 'Enter'})
        expect(mockOnChange).toHaveBeenCalledTimes(0);

        // Need to change some text because pressing enter key without selection close the suggestion list
        rerender(<AutoSuggestTextInput suggestions={suggestions} value="test_" onChange={mockOnChange}/>)

        fireEvent.click(screen.getByText("test_222"))
        expect(mockOnChange).toHaveBeenCalledTimes(1);

        expect(screen.queryByTestId("selected-suggestion")).toHaveTextContent("test_222")
        fireEvent.keyDown(input, {key: 'Enter', code: 'Enter'})

        expect(mockOnChange).toHaveBeenCalledWith("test_222");
        expect(mockOnChange).toHaveBeenCalledTimes(2);
    })
    it("suggests suggestions in props according to text entered", () => {
        const {rerender} = render(<AutoSuggestTextInput suggestions={suggestions} value="test"/>)
        expect(screen.queryByTestId("suggestions")).toBeInTheDocument()

        rerender(<AutoSuggestTextInput suggestions={suggestions} value="itwillneverbefindinthesuggestionlist"/>)
        expect(screen.queryByTestId("suggestions")).not.toBeInTheDocument()

        rerender(<AutoSuggestTextInput suggestions={[]} value="test"/>)
        expect(screen.queryByTestId("suggestions")).not.toBeInTheDocument()
    })
})