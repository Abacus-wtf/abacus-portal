import React from 'react'
import styled from "styled-components";
import { FormInput } from "shards-react";

export const MainInput = styled(FormInput).attrs({
  size: 'sm'
})`
  border: #C3C8D7;
  border-radius: 53px !important;
  padding: 0px;

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &:active {
    border-color: transparent !important;
    box-shadow: !important;
  }

  &:focus {
    border-color: transparent !important;
    box-shadow: !important;
  }

  &:disabled {
    background-color: transparent !important;
  }
`