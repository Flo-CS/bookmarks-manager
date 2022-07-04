import useHover from "./useHover";
import {renderHook} from "@testing-library/react-hooks"
import {fireEvent} from "@testing-library/react";

describe("useHover hook", () => {

    it("hover state should change correctly", () => {
        const testDiv = document.createElement("div");
        const ref = {current: testDiv}

        const {result} = renderHook(() => useHover(ref))

        expect(result.current).toBe(false);
        fireEvent.mouseEnter(testDiv)
        expect(result.current).toBe(true);
        fireEvent.mouseLeave(testDiv)
        expect(result.current).toBe(false);

    })
})