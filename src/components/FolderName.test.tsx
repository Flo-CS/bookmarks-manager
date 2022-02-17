import {render} from "../../tests/utilities";
import {screen} from "@testing-library/react";
import FolderName from "./FolderName";

describe("FolderName component", () => {
    it("has a name", () => {
        render(<FolderName name="aFolderName"/>);
        expect(screen.queryByText("aFolderName")).toBeInTheDocument();
    })
    it("has a icon if icon in props", () => {
        render(<FolderName name="aFolderName" icon={(props) => <svg {...props}>Icon</svg>}/>);
        expect(screen.queryByTestId("icon")).toBeInTheDocument()
    })
})