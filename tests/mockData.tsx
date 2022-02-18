import {Folder} from "../src/@types/folder";
import React from "react";

export const folders: Folder[] = [
    {
        id: "1",
        name: "1",
        icon: () => <svg>1-svg</svg>,
        children: [
            {
                id: "11",
                name: "11",
                icon: () => <svg>12-svg</svg>,
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