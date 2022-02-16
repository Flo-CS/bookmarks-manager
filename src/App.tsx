import React from "react";
import {GlobalStyle} from "./styles/GlobalStyle";
import Theme from "./styles/Theme";
import BookmarkCard from "./components/BookmarkCard";
import TitleGridContainer from "./components/TitleGridContainer";

export function App() {
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

    return (<Theme>
        <GlobalStyle/>
        <div className="app">
            <TitleGridContainer title="December 2021">
                <BookmarkCard {...props}/>
                <BookmarkCard {...props}/>
                <BookmarkCard {...props}/>
            </TitleGridContainer>
            <TitleGridContainer title="January 2022">
                <BookmarkCard {...props}/>
                <BookmarkCard {...props}/>
                <BookmarkCard {...props}/>
            </TitleGridContainer>
        </div>
    </Theme>)
}