import React, {ComponentType, ReactElement} from 'react'
import {render, RenderOptions} from '@testing-library/react'
import {ThemeProvider} from 'styled-components'
import {theme} from "../src/styles/Theme";


function ThemeProviderWrapper(props: any) {
    return (
        <ThemeProvider theme={theme}>
            {props.children}
        </ThemeProvider>
    )
}

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) => {
    return render(ui, {wrapper: ThemeProviderWrapper as ComponentType, ...options});
}


export {customRender as render}