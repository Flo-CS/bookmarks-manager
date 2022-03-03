import {render} from "../../tests/utilities";
import {fireEvent, screen} from "@testing-library/react";
import {bookmark} from "../../tests/mockData";
import BookmarkModal from "./BookmarkModal";

describe("BookmarkModal component", () => {
    it("renders only if isOpen prop is true", () => {
        const {rerender} = render(<BookmarkModal title="hello world" isOpen={false}/>)
        expect(screen.queryByText("hello world")).not.toBeInTheDocument()
        rerender(<BookmarkModal title="hello world" isOpen={true}/>)
        expect(screen.queryByText("hello world")).toBeInTheDocument()
    })
    it("calls onClose on cancel or close button click", () => {
        const handleClose = jest.fn()
        render(<BookmarkModal title="hello world" isOpen={true} onClose={handleClose}/>)
        fireEvent.click(screen.getByRole("button", {name: "close"}))
        expect(handleClose).toHaveBeenCalledTimes(1);
        fireEvent.click(screen.getByRole("button", {name: "cancel"}))
        expect(handleClose).toHaveBeenCalledTimes(2);
    })
    it("calls onFetchBookmarkData only when url input focus is loosed and value has changed", () => {
        const handleFetchBookmarkData = jest.fn();

        render(<BookmarkModal isOpen={true} onFetchBookmarkLink={handleFetchBookmarkData}/>)

        const urlInput = screen.getByLabelText("URL");
        // Focus in, change and focus out
        fireEvent.focusIn(urlInput)
        fireEvent.change(urlInput, {
            target: {
                value: "https://google.com"
            }
        })
        expect(handleFetchBookmarkData).toHaveBeenCalledTimes(0);
        fireEvent.focusOut(urlInput)
        expect(handleFetchBookmarkData).toHaveBeenCalledTimes(1);
        expect(handleFetchBookmarkData).toHaveBeenCalledWith("https://google.com")
        // Focus in, change but keep same value as the precedent and focus out
        fireEvent.focusIn(urlInput)
        fireEvent.change(urlInput, {
            target: {
                value: "https://google.com"
            }
        })
        fireEvent.focusOut(urlInput)
        expect(handleFetchBookmarkData).toHaveBeenCalledTimes(1);
        // Just change without focus
        fireEvent.change(urlInput, {
            target: {
                value: "https://youtube.com"
            }
        })
        expect(handleFetchBookmarkData).toHaveBeenCalledTimes(1);
        // Focus in, change and focus out
        fireEvent.focusIn(urlInput)
        fireEvent.change(urlInput, {
            target: {
                value: "https://google.fr"
            }
        })
        expect(handleFetchBookmarkData).toHaveBeenCalledTimes(1);
        fireEvent.focusOut(urlInput)
        expect(handleFetchBookmarkData).toHaveBeenCalledTimes(2);
        expect(handleFetchBookmarkData).toHaveBeenCalledWith("https://google.fr")

        // Don't call onFetchBookmarkLink if other input field is modified
       fireEvent.change(screen.getByLabelText("description"), {
           target: {
               value: "it is a modification"
           }
       })
        fireEvent.focusIn(urlInput)
        fireEvent.change(urlInput, {
            target: {
                value: "https://youtube.fr"
            }
        })
        fireEvent.focusOut(urlInput)
        expect(handleFetchBookmarkData).toHaveBeenCalledTimes(2);
    })
    it("calls onBookmarkSave with only edited fields after clicking save button", () => {
        const handleBookmarkSave = jest.fn();

        render(<BookmarkModal isOpen={true} onBookmarkSave={handleBookmarkSave} bookmarkData={bookmark}/>)

        const saveButton = screen.getByRole("button", {name: "save button"});
        const urlInput = screen.getByLabelText("URL")
        const descriptionInput = screen.getByLabelText("description")
        const titleInput = screen.getByLabelText("title")

        // No modif
        fireEvent.click(saveButton)
        expect(handleBookmarkSave).toHaveBeenCalledWith(1)
        expect(handleBookmarkSave).toHaveBeenCalledWith({})

        // Only description modif
        fireEvent.change(descriptionInput, {
            target: {
                value: "test"
            }
        })
        fireEvent.click(saveButton)
        expect(handleBookmarkSave).toHaveBeenCalledWith(2)
        expect(handleBookmarkSave).toHaveBeenCalledWith({description: "test"})

        // Description, title and url
        fireEvent.change(descriptionInput, {
            target: {
                value: "test_description"
            }
        })
        fireEvent.change(titleInput, {
            target: {
                value: "test_title"
            }
        })
        fireEvent.change(urlInput, {
            target: {
                value: "test_url"
            }
        })
        fireEvent.click(saveButton)
        expect(handleBookmarkSave).toHaveBeenCalledWith(3)
        expect(handleBookmarkSave).toHaveBeenCalledWith({description: "test_description", title: "test_title", url: "test_url"})
    })
    it("renders bookmark data passed in props", () => {
        render(<BookmarkModal isOpen={true} title="I'm a title" bookmarkData={bookmark}/>)

        expect(screen.queryByText("I'm a title")).toBeInTheDocument()

        expect(screen.queryByDisplayValue(bookmark.linkTitle || "")).toBeInTheDocument()
        expect(screen.queryByDisplayValue(bookmark.url)).toBeInTheDocument()
        expect(screen.queryByDisplayValue(bookmark.description || "")).toBeInTheDocument()

        for (const tag of bookmark.tags || []) {
            expect(screen.queryByText(tag)).toBeInTheDocument()
        }
    })
    it("calls onFetchBookmarkLink if refetch data button is clicked", () => {
        const handleFetchBookmarkData = jest.fn();

        render(<BookmarkModal isOpen={true} onFetchBookmarkLink={handleFetchBookmarkData}/>)

        fireEvent.change(screen.getByLabelText("URL"), {
            target: {
                value: "https://google.com"
            }
        })
        fireEvent.click(screen.getByRole("button", {
            name: "fetch data again"
        }))

        expect(handleFetchBookmarkData).toHaveBeenCalledTimes(1)
        expect(handleFetchBookmarkData).toHaveBeenCalledWith("https://google.com")
    })
    it("refetch data button is disabled if isFetching data", () => {
        const {rerender}  =render(<BookmarkModal isOpen={true} isFetchingData={true}/>)

        expect(screen.getByRole("button", {
            name: "fetch data again"
        })).toBeDisabled()

        rerender(<BookmarkModal isOpen={true} isFetchingData={false}/>)

        expect(screen.getByRole("button", {
            name: "fetch data again"
        })).not.toBeDisabled()
    })
    it.todo("handles invalid url")
})