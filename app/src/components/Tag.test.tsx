import {fireEvent, screen} from "@testing-library/react"
import {render} from "../../../tests/utilities"
import Tag from "./Tag";

describe("Tag component", () => {
    it("have text passed in children", () => {
        render(<Tag>Hello</Tag>)
        expect(screen.getByText("Hello")).toBeInTheDocument()
    })
    it("not have close button if close function isn't in props", () => {
        render(<Tag>Hello</Tag>)
        expect(screen.queryByText(/close/)).toBeNull()
    })
    it("have close button if close function is in props", () => {
        render(<Tag onClose={() => ""}>Hello</Tag>)
        expect(screen.queryByRole("button", {name: /close/})).toBeInTheDocument()
    })
    it("call close function on close button clicked", () => {
        const handleClose = jest.fn()
        render(<Tag onClose={handleClose}>Hello</Tag>)
        fireEvent.click(screen.getByRole("button", {name: /close/}));
        expect(handleClose).toHaveBeenCalledTimes(1)
    })
    it("call click function on tag click", () => {
        const handleClick = jest.fn()
        render(<Tag onClick={handleClick}>Hello</Tag>)
        fireEvent.click(screen.getByText("Hello"));
        expect(handleClick).toHaveBeenCalledTimes(1)
    })
})