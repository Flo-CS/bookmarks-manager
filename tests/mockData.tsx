import {FolderData} from "../src/@types/folder";
import React from "react";

export const folders: FolderData[] = [
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