import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import styled from "styled-components";
import { FormInput, InputGroup, InputGroupAddon, Button } from "shards-react";
import {
  Search
} from 'react-iconly'

const SearchBar = styled(FormInput).attrs({
  size: 'sm',
  type: 'search'
})`
  border: none;
  border-radius: 53px !important;
`

const InputGroupAddonStyles = styled(InputGroupAddon)`
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.15s;
  cursor: pointer;
  opacity: 1.0;

  &:hover {
    opacity: 0.8;
  }

`

const SearchStyled = styled(Search)`
  width: 40px;
  height: 17px;
`

const InputGroupContainer = styled(InputGroup)`
  border: 1px solid #C3C8D7;
  border-radius: 53px !important;
`

interface SearchProps {
  placeholder: string
  input: string
  changeInput: (input: string) => void
  onEnter: () => void
}

export default ({ placeholder, input, changeInput, onEnter }: SearchProps) => {
    return (
        <InputGroupContainer seamless>
          <InputGroupAddonStyles onClick={() => onEnter()} type="prepend">
            <SearchStyled />
          </InputGroupAddonStyles>
          <SearchBar
            value={input}
            onChange={(e) => changeInput(e.target.value)}
            placeholder={placeholder}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onEnter()
              }
            }}
          />
        </InputGroupContainer>
    );
};
