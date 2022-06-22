import React from "react";
import {BookmarkVariant} from "../src/helpers/bookmarks";


export const collections = [
    {
        id: "1",
        name: "1",
        icon: () => <svg>1-svg</svg>,
        children: [
            {
                id: "11",
                name: "11",
                icon: () => <svg>12-svg</svg>
            },
            {
                id: "12",
                name: "12",
                children: [
                    {
                        id: "121",
                        name: "121"
                    },
                ]
            },
        ]
    },
    {
        id: "2",
        name: "2",
        icon: () => <svg>2-svg</svg>,
        children: [
            {
                id: "21",
                name: "21"
            },
        ]
    }]


export const bookmark = {
    id: "",
    siteName: "helloWorld",
    linkTitle: "helloWorldArticle",
    url: "https://helloWorld.com/article",
    tags: ["hello", "bye"],
    creationDate: new Date("21-12-2021"),
    modificationDate: new Date("28-12-2021"),
    collection: "root",
    description: "Hello world article description",
    variant: BookmarkVariant.ICON,
}
