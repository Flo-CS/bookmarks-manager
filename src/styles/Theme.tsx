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
        large: 1.125
    },
    radius: {
        little: "3px",
        medium: "5px"
    }
}

export default function ({children}: { children: React.ReactNode }) {
    return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}