import React from 'react'
import styled from "styled-components";
import { FormInput } from "shards-react";

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

interface InputWithTitle extends React.HTMLProps<HTMLInputElement> {
  title: string
}

export const InputWithTitle = (props: InputWithTitle) => {
  return (
    <>
      <label>{props.title}</label>
      {/**@ts-ignore */}
      <MainInput style={{borderRadius: 0}} size={'lg'} {...props}/>
    </>
  )
}