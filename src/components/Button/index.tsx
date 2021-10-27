import { theme } from "@config/theme";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { Button } from "shards-react";
import styled from "styled-components";

interface IProps {
    title: string;

    // Optional
    onClick?: () => void;
    classes?: any;
    size?: string;

    // with ICON
    withIcon?: boolean;
    icon?: IconProp;
}

const Buttons = styled(Button)`
  background-color: ${theme.colors.accent} !important;
  border-radius: 53px;
  color: ${theme.colors.bg1};
  transition: 0.3s;
  opacity: 1.0;
  font-size: 0.85rem;
  font-weight: 500;
  border: none;
  padding: 11px 16px;
  width: fit-content;
  min-width: fit-content;

  &:hover {
    opacity: 0.8;
    color: ${theme.colors.bg1};
    background-color: ${theme.colors.accent} !important;
    box-shadow: none;
  }
`;

export const ButtonsWhite = styled(Buttons)`
  background-color: #fff !important;
  color: ${theme.colors.text2};
  border: 1px solid #C3C8D7;
  &:hover {
    opacity: 0.8;
    color: ${theme.colors.text2} !important;
    border: 1px solid #C3C8D7;
    background-color: #fff !important;
  }

  &:active {
    box-shadow: none !important;
    color: ${theme.colors.text1} !important;
  }

  &:focus {
    box-shadow: none !important;
    color: ${theme.colors.text1} !important;
  }

  &:disabled {
    opacity: 0.6;
    color: ${theme.colors.text2} !important;
    border: 1px solid #C3C8D7;
    background-color: #fff !important;
  }
`

export const ButtonClear = styled(Buttons)`
  background-color: transparent !important;
  color: black;
  
  &:hover {
    background-color: transparent !important;
    opacity: 0.8;
    color: black; 
  }

  &:active {
      color: black !important;
  }
`

export default Buttons