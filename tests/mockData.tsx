import React from "react";
import {BookmarksCollection} from "../src/helpers/collections";
import {BookmarkDates, BookmarkMetadata, BookmarkMinimal, BookmarkUserComplement} from "../src/helpers/bookmarks";

export const collections: BookmarksCollection[] = [
    {
        key: "1",
        name: "1",
        icon: () => <svg>1-svg</svg>,
        children: [
            {
                key: "11",
                name: "11",
                icon: () => <svg>12-svg</svg>,
            },
            {
                key: "12",
                name: "12",
                children: [
                    {
                        key: "121",
                        name: "121"
                    },
                ]
            },
        ]
    },
    {
        key: "2",
        name: "2",
        icon: () => <svg>2-svg</svg>,
        children: [
            {
                key: "21",
                name: "21"
            },
        ]
    }]

type BookmarkData = BookmarkMinimal & BookmarkUserComplement & BookmarkDates & BookmarkMetadata

export const bookmark: BookmarkData = {
    id: "",
    siteName: "helloWorld",
    linkTitle: "helloWorldArticle",
    url: "https://helloWorld.com/article",
    tags: ["hello", "bye"],
    creationDate: new Date("21-12-2021"),
    modificationDate: new Date("28-12-2021"),
    collection: "root",
    description: "Hello world article description",
    variant: "icon",
}
