import styled from "styled-components"
import BackgroundSource from "@images/title_bg.png"
import { theme } from "@config/theme"

export const BackgroundIMG = styled.img.attrs({
  src: BackgroundSource,
})`
  display: none;
  position: absolute;
  transform: rotate(30deg);
  filter: blur(4px);
  opacity: 0.4;
  height: 450px;
  z-index: -1;
  top: 0;

  @media ${theme.mediaMin.splitCenter} {
    display: unset;
  }
`

export const HeaderBar = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  margin-bottom: 45px;

  @media ${theme.media.phone} {
    flex-direction: column;
  }
`

export const CardContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 20px;
  row-gap: 40px;

  @media ${theme.media.tablet} {
    grid-template-columns: 1fr 1fr 1fr;
  }

  @media ${theme.media.splitCenter} {
    grid-template-columns: 1fr 1fr;
  }

  @media ${theme.media.phone} {
    grid-template-columns: 1fr;
  }
`

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media ${theme.media.phone} {
    align-items: center;
  }
`

export const HeaderBarContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  grid-gap: 12px;
  max-height: 38px;
  margin-top: 15px;

  @media ${theme.mediaMin.splitCenter} {
    margin-top: 0;
    justify-content: flex-start;
    flex-direction: row;
  }
`
