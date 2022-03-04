import {render} from "../../tests/utilities";
import WithLabel from "./WithLabel";
import React from "react";
import {screen} from "@testing-library/react";

describe("WithLabel HOC", () => {
    function SomeComponent(props: React.HTMLAttributes<HTMLDivElement>) {
        return <div data-testid="sub-component" {...props}/>
    }

    const SomeComponentWithHOC = WithLabel(SomeComponent);

    it("renders label and sub component", () => {
        const {rerender} = render(<SomeComponentWithHOC label="test"/>)

        const getLabel = () => {
            return screen.queryByText((content, element) => {
                return element?.tagName.toLowerCase() === 'label' && content === "test";
            })
        }

        expect(getLabel()).toBeInTheDocument()
        expect(getLabel()?.getAttribute("for")).toEqual(screen.getByTestId("sub-component").id)

        rerender(<SomeComponentWithHOC/>)
        expect(getLabel()).not.toBeInTheDocument()


    })
    it("passes others props to sub component", () => {
        render(<SomeComponentWithHOC label="test" data-test="someValue"/>)
        screen.debug()
        expect(screen.getByTestId("sub-component")).toHaveAttribute("data-test", "someValue")
    })
})