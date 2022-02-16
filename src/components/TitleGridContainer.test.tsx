import {render} from "../../tests/utilities";
import TitleGridContainer from "./TitleGridContainer";
import {screen} from "@testing-library/react";

describe("TitleGridContainer component", () => {

    beforeEach(() => {
        render(<TitleGridContainer title="TadaContainer">
            <p data-testid="tada1">tada1</p>
            <p data-testid="tada2">tada2</p>
        </TitleGridContainer>)
    })

    it("Renders children", () => {
        const tada1 = screen.queryByTestId("tada1")
        expect(tada1).toBeInTheDocument()
        expect(tada1).toHaveTextContent("tada1")
        const tada2 = screen.queryByTestId("tada2")
        expect(tada2).toBeInTheDocument()
        expect(tada2).toHaveTextContent("tada2")
    })

    it("Has a title", () => {
        const title = screen.getByRole("heading", {level: 2})
        expect(title).toBeInTheDocument()
        expect(title).toHaveTextContent("TadaContainer")
    })
})