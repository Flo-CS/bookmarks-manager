import React from "react"
import {ThemeProvider} from "styled-components";

export const theme = {
    colors: {
        accent1: "#42792F",
        accent2: "#2F5179",
        white: "#FFFBFF",
        grey: "#262626",
        darkGrey: "#1D1D1D",
        black: "#141414",
    },
    fontSizes: {
        verySmall: 0.75,
        small: 0.875,
        medium: 1,
        big: 1.125
    },
    radius: {
        small: "3px",
        medium: "5px"
    },
    spacing: {
        small: "5px",
        medium: "10px",
        big: "20px",
    }
}

export default function ({children}: { children: React.ReactNode }) {
    return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}