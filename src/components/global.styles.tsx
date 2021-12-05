import { theme } from "@config/theme"
import styled from "styled-components"
import { Col } from "shards-react"

export const Text = styled.span`
  color: ${theme.colors.text1};
  text-align: center;
  font-weight: normal;
`

export const SubText = styled.span`
  font-weight: 400;
  color: ${theme.colors.text2};
  font-size: 0.8rem;
`

export const Subheader = styled.h4`
  color: ${theme.colors.text2} !important;
  font-weight: bold;
  text-align: left;
  font-size: 1rem;
  margin: 0px !important;
`

export const UniversalContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding-bottom: 0px;
`

export const SmallUniversalContainer = styled(UniversalContainer)`
  max-width: 1100px;
`

export const Title = styled.h2`
  color: ${theme.colors.text1} !important;
  font-weight: 900;
  font-size: 1.5rem;
  text-align: left;
  margin: 0px !important;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const MainContainer = styled(Col)`
  display: flex;
  flex-direction: column;
  padding: 32px;
  grid-gap: 24px;
  padding-top: 32px;
`

export const CategoryButton = styled.div<{ active: boolean }>`
  font-weight: 400;
  padding: 8px 16px;
  border-radius: 20px;
  opacity: 1;
  cursor: pointer;
  transition: 0.3s;
  font-size: 0.85rem;
  width: fit-content;
  color: ${({ theme }) => theme.colors.text1};

  &:hover {
    opacity: 0.8;
  }

  ${({ active, theme }) =>
    active &&
    `
        cursor: default;
        color: ${theme.colors.accent};
        background-color: rgba(89,89,89, 0.06);
        &:hover {
            opacity: 1.0;
        }
    `}
`

export const ImageContainer = styled.div<{ src: string }>`
  width: 100%;
  height: 100%;
  border: 1px solid #c3c8d7;
  background-image: url("${({ src }) => src}");
  background-size: contain;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 7px;
  background-position: center;
  background-color: black;
  border-radius: 6px;
`

export const Label = styled.label`
  font-weight: 500;
  font-size: 0.9rem;
  cursor: default;
`
