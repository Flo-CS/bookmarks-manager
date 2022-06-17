import {css} from "styled-components";

// TODO: Use component instead
export const buttonReset = css`
  border: none;
  background-color: transparent;
  cursor: pointer;
  color: ${props => props.theme.colors.white};
`