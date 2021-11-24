import * as React from "react"
import styled from "styled-components"
import { FormInput, InputGroup, InputGroupAddon } from "shards-react"
import { Search } from "react-iconly"

const SearchBar = styled(FormInput).attrs({
  size: "sm",
  type: "search",
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
  opacity: 1;

  &:hover {
    opacity: 0.8;
  }
`

const SearchStyled = styled(Search)`
  width: 40px;
  height: 17px;
`

const InputGroupContainer = styled(InputGroup)`
  border: 1px solid #c3c8d7;
  border-radius: 53px !important;
`

interface SearchProps {
  placeholder: string
  onEnter: (searchValue: string) => void
}

export default ({ placeholder, onEnter }: SearchProps) => {
  const [searchValue, setSearchValue] = React.useState("")
  const search = () => {
    onEnter(searchValue)
  }
  return (
    <InputGroupContainer seamless>
      <InputGroupAddonStyles onClick={search} type="prepend">
        <SearchStyled />
      </InputGroupAddonStyles>
      <SearchBar
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder={placeholder}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            search()
          }
        }}
      />
    </InputGroupContainer>
  )
}
