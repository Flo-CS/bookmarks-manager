import React from "react";
import {BookmarkVariant} from "../utils/bookmarks";
import {TreeCollection} from "../src/components/CollectionsTree";

export const collections: TreeCollection[] = [
    {
        id: "1",
        name: "1",
        index: 0,
        icon: () => <svg>1-svg</svg>,
        children: [
            {
                id: "11",
                name: "11",
                index: 0,
                icon: () => <svg>12-svg</svg>,
            },
            {
                id: "12",
                name: "12",
                index: 1,
                children: [
                    {
                        id: "121",
                        name: "121",
                        index: 0
                    },
                ]
            },
        ]
    },
    {
        id: "2",
        name: "2",
        index: 1,
        icon: () => <svg>2-svg</svg>,
        children: [
            {
                id: "21",
                name: "21",
                index: 0
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
