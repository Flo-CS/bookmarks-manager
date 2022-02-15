import {render} from "../../tests/utilities"
import BookmarkCard from "./BookmarkCard";
import {fireEvent, screen} from "@testing-library/react";
import {formatDistanceToNow} from "date-fns";

describe('BookmarkCard component', () => {

    jest.useFakeTimers().setSystemTime(new Date("2022-02-14T20:00:00"))

    const props = {
        variant: "preview" as const,
        title: "This is a title",
        id: "e6c1b24d-f999-4fa9-b204-54713e735c84",
        link: "https://google.com",
        picturePath: "https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png",
        description: "Google, moteur de recherche",
        tags: ["tag1", "tag2"],
        datetime: new Date("2022-02-14T08:00:00")
    }
    beforeEach(() => {
        render(<BookmarkCard {...props}/>)
    })

    it("has all elements rendered", () => {
        // Title
        const title = screen.getByRole("heading", {level: 3})
        expect(title).toHaveTextContent(props.title);
        // Picture
        const picture = screen.queryByAltText("Preview or website icon picture")
        expect(picture).toBeInTheDocument()
        // Link
        const link = screen.getByRole("link")
        expect(link).toHaveTextContent(props.link)
        expect(link).toHaveAttribute("href", props.link)
        // Description
        const description = screen.getByText(props.description)
        expect(description).toHaveTextContent(props.description)
        // Datetime
        const datetime = screen.getByTestId("datetime")
        expect(datetime).toHaveAttribute("datetime", props.datetime.toISOString())

        const distanceDate = formatDistanceToNow(props.datetime, {addSuffix: true})
        expect(datetime).toHaveTextContent(distanceDate)

        // Tags
        for (let i = 0; i < props.tags.length; i++) {
            expect(screen.getByText(props.tags[i])).toBeInTheDocument()
        }

    })
    it("show menu and three buttons on hover and hide date", () => {
        const card = screen.getByRole("article");
        let datetime = screen.queryByTestId("datetime")
        let menu = screen.getByTestId("menu");

        expect(datetime).toBeVisible()
        expect(menu).not.toBeVisible()

        fireEvent.mouseEnter(card)
        datetime = screen.queryByTestId("datetime")
        menu = screen.getByTestId("menu");
        expect(datetime).not.toBeInTheDocument()
        expect(menu).toBeVisible()

        fireEvent.mouseLeave(card)
        datetime = screen.queryByTestId("datetime")
        menu = screen.getByTestId("menu");
        expect(datetime).toBeInTheDocument()
        expect(menu).not.toBeVisible()
    })
    it.todo("copy link to clipboard on copy button click")
    it.todo("call onDelete function (with id) on delete button clicked")
    it.todo("call onEdit (with id) function on edit button clicked")
    it.todo("call onTagRemove function with the correct tag name as params on tag delete button click")
});