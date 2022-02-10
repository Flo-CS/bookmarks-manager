import { createGlobalStyle } from 'styled-components'
import {theme} from "./Theme";

export const GlobalStyle = createGlobalStyle<{theme: typeof theme}>`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body, html, #root {
    font-family: "Open Sans", sans-serif;
    font-size: ${props => props.theme.fontSizes.medium};
    color: #FFFBFF;
    width: 100%;
    height: 100%;
  }
`
