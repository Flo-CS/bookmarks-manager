import {ThemeType} from "./Theme"

declare module "styled-components" {
    export interface DefaultTheme extends ThemeType {
    }
}