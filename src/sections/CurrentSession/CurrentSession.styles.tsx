import React from 'react'
import styled from "styled-components"
import { ListGroupItem } from "shards-react"
import { Text } from "@components/global.styles"
import { ImageContainer } from "@components/global.styles"
import { HorizontalListGroup } from "@components/ListGroupMods"

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
  max-width: 100%;
  overflow: hidden;
`

export const VerticalSmallGapContainer = styled(VerticalContainer)`
  grid-gap: 2px;
  overflow: hidden;
`

export const SquareImageContainer = styled(ImageContainer)`
  max-height: 450px;
  &:after {
    content: "";
    display: block;
    padding-bottom: 100%;
  }
`

export const FileContainer = (props: {animation_url: string | null, image_url: string}) => {
  if (props.animation_url) {
    const format = props.animation_url.slice(-3)
    if (format === 'gif') {
      return <SquareImageContainer src={props.animation_url} />
    } else if (format === 'mp4' || format === 'ogg'|| props.animation_url.slice(-4) === 'webm') {
      return <SquareImageContainer muted controls as={'video'} src={props.animation_url}/>
    } else {
      return <SquareImageContainer as={'iframe'} src={props.animation_url}/>
    }
  }

  return <SquareImageContainer src={props.image_url} />
}

export const SubText = styled(Text)`
  color: ${({ theme }) => theme.colors.text2};
  text-align: left;
`

export const HorizontalListGroupModified = styled(HorizontalListGroup)`
  .list-group-item {
    border-bottom-left-radius: 0px !important;
    border-bottom-right-radius: 0px !important;
    border-bottom: none;
  }
`

export const ListGroupItemMinWidth = styled(ListGroupItem)`
  padding-right: 20px;
  min-width: fit-content;
`
