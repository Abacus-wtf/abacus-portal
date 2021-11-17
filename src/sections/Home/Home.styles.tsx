import styled from 'styled-components'
import BackgroundSource from "@images/title_bg.png"

export const BackgroundIMG = styled.img.attrs({
  src: BackgroundSource,
})`
  position: absolute;
  transform: rotate(30deg);
  filter: blur(4px);
  opacity: 0.4;
  height: 450px;
  z-index: -1;
  top: 0;
`

export const HeaderBar = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  margin-bottom: 45px;
`

export const CardContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 20px;
  row-gap: 40px;
`