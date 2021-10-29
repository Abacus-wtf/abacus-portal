import styled from "styled-components"
import { Text } from "@components/global.styles"
import { ImageContainer } from "@components/global.styles"

export const SplitContainer = styled.div`
  display: grid;
  grid-template-columns: 4fr 3fr;
  grid-gap: 40px;
  width: 100%;

  @media ${({ theme }) => theme.media.splitCenter} {
    grid-template-columns: 1fr;
  }
`

export const VerticalContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  grid-gap: 15px;
`

export const VerticalSmallGapContainer = styled(VerticalContainer)`
  grid-gap: 2px;
`

export const SquareImageContainer = styled(ImageContainer)`
  max-height: 450px;
  &:after {
    content: "";
    display: block;
    padding-bottom: 100%;
  }
`

export const SubText = styled(Text)`
  color: ${({ theme }) => theme.colors.text2};
  text-align: left;
`
