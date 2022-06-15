import {render} from "../../tests/utilities";
import CollectionName from "./CollectionName";
import CollectionsBreadCrumb from "./CollectionsBreadCrumb"
import {screen} from "@testing-library/react";

describe("CollectionsBreadCrumb component", () => {
    it("renders all collections", () => {
        render(<CollectionsBreadCrumb>
            <CollectionName name="Collection"/>
            <CollectionName name="Collection"/>
            <CollectionName name="Collection"/>
        </CollectionsBreadCrumb>)

        expect(screen.getAllByText("Collection")).toHaveLength(3)
    })
})