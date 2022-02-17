import {render} from "../../tests/utilities";
import FolderName from "./FolderName";
import FoldersBreadCrumb from "./FoldersBreadCrumb"
import {screen} from "@testing-library/react";

describe("FoldersBreadCrumb component", () => {
    it("renders all folders", () => {
        render(<FoldersBreadCrumb>
            <FolderName name="Folder"/>
            <FolderName name="Folder"/>
            <FolderName name="Folder"/>
        </FoldersBreadCrumb>)

        expect(screen.getAllByText("Folder")).toHaveLength(3)
    })
})