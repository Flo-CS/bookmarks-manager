import {render} from "../../../tests/utilities";
import {fireEvent, screen} from "@testing-library/react";
import CollectionTreeItem from "./CollectionTreeItem";
import {theme} from "../styles/Theme";

describe("CollectionTreeItem component", () => {
    const props = {
        name: "aCollectionName",
        collectionId: "ImAnId"
        // icon: () => <svg>Icon</svg>,
    }

    it("has collection name", () => {
        render(<CollectionTreeItem {...props}/>)
        expect(screen.getByText("aCollectionName")).toHaveTextContent(props.name)
    })
    it("has count if count in props", () => {
        render(<CollectionTreeItem {...props} count={10}/>)
        expect(screen.getByText("10")).toBeInTheDocument();
    })
    it("doesn't have count if count not in props", () => {
        render(<CollectionTreeItem {...props}/>)
        expect(screen.queryByRole("paragraph", {name: /collection items count/i})).not.toBeInTheDocument()
    })
    it("call onClick on collection item click", () => {
        const onClickMock = jest.fn()
        render(<CollectionTreeItem {...props} onClick={onClickMock}/>)
        const collectionItem = screen.getByText("aCollectionName")
        fireEvent.click(collectionItem)
        expect(onClickMock).toHaveBeenCalledTimes(1);
        expect(onClickMock).toHaveBeenCalledWith(props.collectionId)
    })
    it("show toggle folding button if it has children", () => {
        render(<CollectionTreeItem {...props}>
            <CollectionTreeItem collectionId="1" name="subCollectionName"/>
            <CollectionTreeItem collectionId="2" name="subCollectionName"/>
        </CollectionTreeItem>)

        // As children doesn't have children, only one toggle folding button will be in the DOM
        const toggleFoldingButton = screen.queryByRole("button", {name: /toggle children folding/i})
        expect(toggleFoldingButton).toBeInTheDocument()
    })
    it("doesn't show toggle folding button if it doesn't have children", () => {
        render(<CollectionTreeItem {...props} >

        </CollectionTreeItem>)

        const toggleFoldingButton = screen.queryByRole("button", {name: /toggle children folding/i})
        expect(toggleFoldingButton).not.toBeInTheDocument()
    })
    it("show children only if isUnfolded and toggle it", () => {
        render(<CollectionTreeItem {...props} isDefaultFolded={true}>
            <CollectionTreeItem collectionId="1" name="subCollectionName"/>
            <CollectionTreeItem collectionId="2" name="subCollectionName"/>
        </CollectionTreeItem>)

        const toggleFoldingButton = screen.getByRole("button", {name: /toggle children folding/i})
        screen.queryAllByText("subCollectionName").forEach((elem) => {
            expect(elem).not.toBeVisible()
        })
        fireEvent.click(toggleFoldingButton)
        screen.queryAllByText("subCollectionName").forEach((elem) => {
            expect(elem).toBeVisible()
        })
        fireEvent.click(toggleFoldingButton)
        screen.queryAllByText("subCollectionName").forEach((elem) => {
            expect(elem).not.toBeVisible()
        })
    })
    // Note: Will no longer works because of the use of pseudo-element
    it.skip("change color if it is selected", () => {
        render(<>
                <CollectionTreeItem collectionId="1" name="1" isSelected={false}/>
                <CollectionTreeItem collectionId="2" name="2" isSelected={true}/>
            </>
        )
        const c1 = screen.getByText("1").closest("div[data-testid^='collection-wrapper']")
        const c2 = screen.getByText("2").closest("div[data-testid^='collection-wrapper']")

        expect(c1).toHaveStyle(`background-color: ${theme.colors.black}`)
        expect(c2).toHaveStyle(`background-color: ${theme.colors.accent1}`,)
    })
})