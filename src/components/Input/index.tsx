import React from 'react'
import styled from "styled-components";
import { FormInput } from "shards-react";
import {Label} from '../global.styles'

export const MainInput = styled(FormInput).attrs((props) => {
  size: props.size || 'sm'
})`
  border: #C3C8D7;
  border-radius: 53px;
  padding: 0px;

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &:active {
    border-color: transparent !important;
    box-shadow: none !important;
  }

  .form-control:focus {
    border-color: transparent !important;
    box-shadow: none !important;
  }

  &:focus {
    border-color: transparent !important;
    box-shadow: none !important;
  }

  &:disabled {
    background-color: transparent !important;
  }
`

interface InputWithTitle extends React.ComponentProps<FormInput> {
  title: string
}

export const InputWithTitle = (props: InputWithTitle) => {
  return (
    <>
      <Label>{props.title}</Label>
      <MainInput style={{borderRadius: 0}} size={'lg'} {...props}/>
    </>
  )
}