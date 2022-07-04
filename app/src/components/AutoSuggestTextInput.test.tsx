import {render} from "../../../tests/utilities";
import {AutoSuggestTextInput} from "./AutoSuggestTextInput";
import {fireEvent, screen} from "@testing-library/react";

describe("AutoSuggestTextInput component", () => {
    let suggestions: string[];
    beforeAll(() => {
        suggestions = ["test_111", "test_222", "test_333"]
    })
    it("handles keyboard arrow navigation in suggestion list", () => {
        render(<AutoSuggestTextInput suggestions={suggestions} inputValue="test"/>)
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
    it("calls onSuggestionValidation on click", () => {
        const mockOnSuggestionValidation = jest.fn();
        render(<AutoSuggestTextInput suggestions={suggestions} inputValue="test"
                                     onSuggestionValidation={mockOnSuggestionValidation}/>)

        fireEvent.click(screen.getByText("test_222"))

        expect(screen.queryByTestId("selected-suggestion")).not.toBeInTheDocument()
        expect(screen.queryByTestId("suggestions")).not.toBeInTheDocument()
        expect(mockOnSuggestionValidation).toHaveBeenCalledWith("test_222");
        expect(mockOnSuggestionValidation).toHaveBeenCalledTimes(1);
    })
    it("closes suggestion list on pressing escape", () => {
        render(<AutoSuggestTextInput suggestions={suggestions} inputValue="test"/>)
        const input = screen.getByRole("textbox");

        expect(screen.queryByTestId("suggestions")).toBeInTheDocument()
        for (let i = 0; i < 2; i++) {
            fireEvent.keyDown(input, {key: 'ArrowDown', code: 'ArrowDown'})
        }
        fireEvent.keyDown(input, {key: 'Escape', code: 'Escape'})

        expect(screen.queryByTestId("suggestions")).not.toBeInTheDocument()
        expect(screen.queryByTestId("selected-suggestion")).not.toBeInTheDocument()
    })
    it("calls onInputChange on text input", () => {
        const mockOnChange = jest.fn();
        render(<AutoSuggestTextInput suggestions={suggestions} inputValue="test" onInputChange={mockOnChange}/>)

        const input = screen.getByRole("textbox");

        fireEvent.change(input, {
            target: {
                value: "hello"
            }
        })
        expect(mockOnChange).toHaveBeenCalledWith("hello");
        expect(mockOnChange).toHaveBeenCalledTimes(1);
    })
    it("calls onSuggestionValidation on 'enter' key press", () => {
        const mockOnSuggestionValidation = jest.fn();
        const {rerender} = render(<AutoSuggestTextInput suggestions={suggestions} inputValue="test"
                                                        onSuggestionValidation={mockOnSuggestionValidation}/>)
        const input = screen.getByRole("textbox");

        expect(screen.queryByTestId("selected-suggestion")).not.toBeInTheDocument()
        fireEvent.keyDown(input, {key: 'Enter', code: 'Enter'})
        expect(mockOnSuggestionValidation).toHaveBeenCalledTimes(1);
        expect(mockOnSuggestionValidation).toHaveBeenCalledWith(null)

        // Need to change some text because pressing enter key without selection close the suggestion list
        rerender(<AutoSuggestTextInput suggestions={suggestions} inputValue="test_"
                                       onSuggestionValidation={mockOnSuggestionValidation}/>)

        for (let i = 0; i < 2; i++) {
            fireEvent.keyDown(input, {key: 'ArrowDown', code: 'ArrowDown'})
        }

        expect(screen.queryByTestId("selected-suggestion")).toHaveTextContent("test_222")
        fireEvent.keyDown(input, {key: 'Enter', code: 'Enter'})

        expect(mockOnSuggestionValidation).toHaveBeenCalledTimes(2);
        expect(mockOnSuggestionValidation).toHaveBeenCalledWith("test_222");
        expect(screen.queryByTestId("suggestions")).not.toBeInTheDocument()
        expect(screen.queryByTestId("selected-suggestion")).not.toBeInTheDocument()
    })
    it("suggests suggestions in props according to text entered", () => {
        const {rerender} = render(<AutoSuggestTextInput suggestions={suggestions} inputValue="test"/>)
        expect(screen.queryByTestId("suggestions")).toBeInTheDocument()

        rerender(<AutoSuggestTextInput suggestions={suggestions} inputValue="itwillneverbefindinthesuggestionlist"/>)
        expect(screen.queryByTestId("suggestions")).not.toBeInTheDocument()

        rerender(<AutoSuggestTextInput suggestions={[]} inputValue="test"/>)
        expect(screen.queryByTestId("suggestions")).not.toBeInTheDocument()
    })
})