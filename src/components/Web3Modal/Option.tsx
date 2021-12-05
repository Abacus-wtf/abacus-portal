import React from "react"
import styled from "styled-components"
import { OutboundLink } from "gatsby-plugin-google-gtag"

const ExternalLink = styled(OutboundLink).attrs({
  target: "_blank",
})

const InfoCard = styled.button<{ active?: boolean }>`
  padding: 1rem;
  outline: none;
  border-radius: 12px;
  width: 100% !important;
  border: none;
`

const OptionCard = styled(InfoCard as any)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 2rem;
  padding: 1rem;
`

const OptionCardLeft = styled.div`
  justify-content: center;
  height: 100%;
`

const OptionCardClickable = styled(OptionCard as any)<{ clickable?: boolean }>`
  margin-top: 0;
  background-color: transparent;
  transition: 0.3s;
  &:hover {
    opacity: 0.6;
  }
  display: flex;
  flex-direction: column;
  justify-content: center;
  grid-gap: 7px;

  opacity: ${({ disabled }) => (disabled ? "0.5" : "1")};
`

const GreenCircle = styled.div`
  justify-content: center;
  align-items: center;

  &:first-child {
    height: 8px;
    width: 8px;
    margin-right: 8px;
    border-radius: 50%;
  }
`

const CircleWrapper = styled.div`
  color: green;
  display: flex;
  justify-content: center;
  align-items: center;
`

const HeaderText = styled.div`
  color: ${(props) =>
    props.color === "blue"
      ? ({ theme }) => theme.primary1
      : ({ theme }) => theme.text1};
  font-size: 1rem;
  font-weight: 500;
`

const SubHeader = styled.div`
  color: ${({ theme }) => theme.color.text1};
  margin-top: 10px;
  font-size: 12px;
`

const IconWrapper = styled.div<{ size?: number | null }>`
  align-items: center;
  justify-content: center;
  & > img,
  span {
    height: 80px;
    width: 80px;
  }
`

export default function Option({
  link = null,
  size,
  onClick = null,
  color,
  header,
  subheader = null,
  icon,
  active = false,
  id,
}: {
  link?: string | null
  size?: number | null
  onClick?: null | (() => void)
  color: string
  header: React.ReactNode
  subheader: React.ReactNode | null
  icon: string
  active?: boolean
  id: string
}) {
  const content = (
    <OptionCardClickable id={id} onClick={onClick} active={active}>
      <IconWrapper size={size}>
        <img src={icon} alt="Icon" />
      </IconWrapper>
      <OptionCardLeft>
        <HeaderText color={color}>
          {active ? (
            <CircleWrapper>
              <GreenCircle>
                <div />
              </GreenCircle>
            </CircleWrapper>
          ) : (
            ""
          )}
          Connect with {header}
        </HeaderText>
        {subheader && <SubHeader>{subheader}</SubHeader>}
      </OptionCardLeft>
    </OptionCardClickable>
  )
  if (link) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return <ExternalLink href={link}>{content}</ExternalLink>
  }

  return content
}
