import {fireEvent, screen} from "@testing-library/react"
import {render} from "../../tests/utilities"
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
        render(<Tag onClose={() => {}}>Hello</Tag>)
        expect(screen.queryByRole("button", {name: /close/})).toBeInTheDocument()
    })
    it("call close function on close button clicked", () => {
        let isClicked = false;
        render(<Tag onClose={() => {isClicked = true}}>Hello</Tag>)
        fireEvent.click(screen.getByRole("button", {name: /close/}));
        expect(isClicked).toBeTruthy();
    })
    it("call click function on tag click", () => {
        let isClicked = false;
        render(<Tag onClick={() => {isClicked = true}}>Hello</Tag>)
        fireEvent.click(screen.getByText("Hello"));
        expect(isClicked).toBeTruthy();
    })
})