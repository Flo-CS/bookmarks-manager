import {ThemeType} from "../app/src/styles/Theme"

declare module "styled-components" {
    export interface DefaultTheme extends ThemeType {
    }
}