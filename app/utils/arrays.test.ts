import {loopNext, loopPrevious} from "./arrays";

describe("arrays loopNext and loopPrevious", () => {
    let arr0: string[]
    let arr1: { key: string, next: string, back: string }[]
    beforeAll(() => {
        arr0 = ["1", "2", "3"]
        arr1 = [{key: "1", next: "2", back: "3"}, {key: "2", next: "3", back: "1"}, {key: "3", next: "1", back: "2"}]
    })

    it("returns null if array is empty", () => {
        expect(loopNext([], "test")).toEqual(null);
        expect(loopPrevious([], "test")).toEqual(null);

    })
    it("navigates correctly between array elements", () => {
        for (const elem of arr1) {
            expect(loopNext(arr0, elem.key)).toEqual(elem.next)
            expect(loopPrevious(arr0, elem.key)).toEqual(elem.back)
        }
    })
    it("returns respectively first and back element if the element to find is not found", () => {
        expect(loopNext(arr0, "test")).toEqual("1");
        expect(loopPrevious(arr0, "test")).toEqual("3");

        expect(loopNext(arr0, null)).toEqual("1");
        expect(loopPrevious(arr0, null)).toEqual("3");
    })
})