import React, {ComponentType, ReactElement} from 'react'
import {render, RenderOptions} from '@testing-library/react'
import {ThemeProvider} from 'styled-components'
import {theme} from "../app/src/styles/Theme";

type Props = {
    children: React.ReactNode
}

function ThemeProviderWrapper({children}: Props) {
    return (
        <ThemeProvider theme={theme}>
            {children}
        </ThemeProvider>
    )
}

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) => {
    return render(ui, {wrapper: ThemeProviderWrapper as ComponentType, ...options});
}


export {customRender as render}