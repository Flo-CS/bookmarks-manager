import React from "react";
import CollectionsTree from "./CollectionsTree"
import CollectionTreeItem from "./CollectionTreeItem";
import {render} from "../../tests/utilities";
import {cleanup, fireEvent, screen, within} from "@testing-library/react";
import {theme} from "../styles/Theme";
import {collections} from "../../tests/mockData";
import {Collection} from "../helpers/collections";


describe("CollectionsTreeView component", () => {

    it("renders collections hierarchy correctly", () => {
        render(<CollectionsTree collections={collections}/>)

        function mapCollections(collections: Collection[], parentElement?: HTMLElement) {
            collections.forEach((collection) => {

                let collectionElem;
                if (parentElement) {
                    collectionElem = within(parentElement).queryByTestId(`collection-wrapper-${collection.id}`)
                } else {
                    collectionElem = screen.queryByTestId(`collection-wrapper-${collection.id}`)
                }

                expect(collectionElem).toBeInTheDocument()

                if (collection.children && collectionElem) {
                    mapCollections(collection.children, collectionElem)
                }
            })

        }

        mapCollections(collections)
    })
    it("uses children if children in props", () => {
        render(<CollectionsTree collections={collections}>
            <CollectionTreeItem collectionId="1" name="children1">
                <CollectionTreeItem collectionId="11" name="children11"/>
            </CollectionTreeItem>
        </CollectionsTree>)

        expect(screen.queryByText("children1")).toBeInTheDocument()
        expect(screen.queryByText("children11")).toBeInTheDocument()
    })
    it("handles collection click", () => {
        const onCollectionClickMock = jest.fn();

        render(<CollectionsTree collections={collections} onCollectionClick={onCollectionClickMock}/>)
        fireEvent.click(screen.getByText("1", {exact: true}))
        expect(onCollectionClickMock).toHaveBeenCalledWith("1")
        expect(onCollectionClickMock).toHaveBeenCalledTimes(1)
        fireEvent.click(screen.getByText("121", {exact: true}))
        expect(onCollectionClickMock).toHaveBeenCalledWith("121")
        expect(onCollectionClickMock).toHaveBeenCalledTimes(2)

        cleanup()
        render(<CollectionsTree onCollectionClick={onCollectionClickMock}>
            <CollectionTreeItem collectionId="1" name="1"/>
        </CollectionsTree>)
        fireEvent.click(screen.getByText("1", {exact: true}))
        expect(onCollectionClickMock).toHaveBeenCalledWith("1")
        expect(onCollectionClickMock).toHaveBeenCalledTimes(3)


    })
    // Note: Will no longer works because of the use of pseudo-element
    it.skip("selects the correct collection with the selectedCollectionId in props", () => {
        render(<CollectionsTree collections={collections} selectedCollectionId="121"/>)
        expect(screen.queryByTestId("collection-wrapper-121")).toHaveStyle(`background-color: ${theme.colors.accent1}`) // TODO: Change this
    })
})