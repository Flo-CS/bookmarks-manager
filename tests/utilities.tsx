import React, {FC, ReactElement} from 'react'
import {render, RenderOptions} from '@testing-library/react'
import {ThemeProvider} from 'styled-components'
import {theme} from "../src/styles/Theme";

const ThemeProviderWrapper : FC = ({children}) => {
    return (
        <ThemeProvider theme={theme}>
            {children}
        </ThemeProvider>
    )
}

const customRender = (ui:ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
    render(ui, {wrapper: ThemeProviderWrapper, ...options})

// re-export everything
export * from '@testing-library/react'

// override render method
export {customRender as render}