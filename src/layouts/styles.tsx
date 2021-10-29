import { theme } from "@config/theme"
import { createGlobalStyle } from "styled-components"

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
  }
  
  .list-group-item {
    margin-bottom: 0px;
  }

  .form-control.is-invalid {
    box-shadow: none !important;
  }

  body {
    background-color: ${theme.colors.bg1};
    height: 100vh;
  }

  h1, h2,h3, h4, p {
    color: ${theme.colors.text1} !important;
  }

  a {
    transition: 0.15s;
    &:hover {
      color: ${theme.colors.accent};
      text-decoration: none;
    }
  }
`
