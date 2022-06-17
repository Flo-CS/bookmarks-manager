import {ThemeType} from "../src/styles/Theme"

declare module "styled-components" {
    export interface DefaultTheme extends ThemeType {
    }
}