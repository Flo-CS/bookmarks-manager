import { createGlobalStyle } from 'styled-components'
import {theme} from "./Theme";

export const GlobalStyle = createGlobalStyle<{theme: typeof theme}>`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "Open Sans", sans-serif;
    font-size: 16px;
  }

  body, html, #root {
    color: #FFFBFF;
    width: 100%;
    height: 100%;
    background-color: ${props => props.theme.colors.black};
  }
  
  
`
