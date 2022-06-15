import {render} from "../../tests/utilities";
import {cleanup, fireEvent, screen} from "@testing-library/react";
import CollectionName from "./CollectionName";

describe("CollectionName component", () => {
    it("has a name", () => {
        render(<CollectionName name="aCollectionName"/>);
        expect(screen.queryByText("aCollectionName")).toBeInTheDocument();
    })
    it("has a icon if icon in props", () => {
        render(<CollectionName name="aCollectionName" icon={(props) => <svg {...props}>Icon</svg>}/>);
        expect(screen.queryByTestId("icon")).toBeInTheDocument()
    })
    it("calls onClick on click with collectionId", () => {
        const onClickMock = jest.fn()
        render(<CollectionName name="aCollectionName" collectionId="aCollectionId" onClick={onClickMock}/>)

        fireEvent.click(screen.getByText("aCollectionName"))

        expect(onClickMock).toHaveBeenCalledWith("aCollectionId")
        expect(onClickMock).toHaveBeenCalledTimes(1)

        cleanup()

        render(<CollectionName name="aCollectionName" onClick={onClickMock}/>)
        fireEvent.click(screen.getByText("aCollectionName"))

        expect(onClickMock).toHaveBeenCalledWith(null)
        expect(onClickMock).toHaveBeenCalledTimes(2)
    })
    it("has button role if onClick prop", () => {
        const onClickMock = jest.fn()
        render(<CollectionName name="aCollectionName" collectionId="aCollectionId" onClick={onClickMock}/>)

        expect(screen.queryByRole("button")).toBeInTheDocument()
        cleanup()
        render(<CollectionName name="aCollectionName" collectionId="aCollectionId"/>)

        expect(screen.queryByRole("button")).not.toBeInTheDocument()

    })
})