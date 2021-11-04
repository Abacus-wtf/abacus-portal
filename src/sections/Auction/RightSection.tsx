import React, {
  FormEvent,
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from "react"
import { ThemeContext } from "styled-components"
import { Label } from "@components/global.styles"
import Button from "@components/Button"
import {
  HorizontalListGroup,
  ListGroupHeader,
  ListGroupSubtext,
} from "@components/ListGroupMods"
import { ListGroupItem, ListGroup, Form, Tooltip } from "shards-react"
import {
  VerticalContainer,
  ListGroupItemMinWidth,
} from "../CurrentSession/CurrentSession.styles"
import SessionCountdown from "../CurrentSession/CurrentState/SessionCountdown"
import { useAuctionData, useSetAuctionData } from "@state/auctionData/hooks"
import { InputWithTitle } from "@components/Input"
import { useActiveWeb3React } from "@hooks/index"
import { ZERO_ADDRESS } from "@config/constants"
import _ from "lodash"
import { useOnBid, useOnClaim } from "@hooks/auction"

const RightSection: FunctionComponent = () => {
  const { account } = useActiveWeb3React()
  const auctionData = useAuctionData()
  const [isToolTipOpen, setIsToolTipOpen] = useState(false)
  const { onBid, isPending } = useOnBid()
  const { onClaim, isPending: isPendingClaim } = useOnClaim()
  const [nftAddress, setNftAddress] = useState()
  const [tokenId, setTokenId] = useState()

  const setAuctionData = useSetAuctionData()

  const theme = useContext(ThemeContext)
  return (
    <>
      <HorizontalListGroup>
        <ListGroupItemMinWidth>
          <Label>Highest Bid</Label>
          <ListGroupHeader style={{ color: theme.colors.accent }}>
            {auctionData.highestBid} ETH
          </ListGroupHeader>
          <ListGroupSubtext>
            ($
            {auctionData.highestBidDollars.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            )
          </ListGroupSubtext>
        </ListGroupItemMinWidth>
        <SessionCountdown
          overrideEndTime={auctionData.endTime}
          overrideOnComplete={async () => {
            await setAuctionData()
          }}
          overrideTitle={"Bidding Ends In"}
        />
      </HorizontalListGroup>
      <Form
        onSubmit={async (e: FormEvent<HTMLDivElement>) => {
          e.preventDefault()

          if (Number(e.target["bid"].value) <= auctionData.highestBid) {
            alert(
              `You tried to bid lower than or the same as the highest bid. Please bid higher than ${auctionData.highestBid} Ether.`
            )
            return
          }

          await onBid(
            e.target["bid"].value,
            e.target["initAppraisal"].value,
            e.target["nftAddress"].value,
            e.target["tokenId"].value
          )
        }}
      >
        <ListGroup>
          <ListGroupItem>
            <InputWithTitle title={"Bid"} id={"bid"} placeholder="0" />
          </ListGroupItem>
          <ListGroupItem>
            <InputWithTitle
              title={"Initial Appraisal"}
              id={"initAppraisal"}
              placeholder="0.001"
            />
          </ListGroupItem>
          <ListGroupItem>
            <InputWithTitle
              title={"NFT Address"}
              id={"nftAddress"}
              placeholder={ZERO_ADDRESS}
              value={nftAddress}
              onChange={e => setNftAddress(e.target.value)}
            />
          </ListGroupItem>
          <ListGroupItem>
            <InputWithTitle
              title={"Token ID"}
              id={"tokenId"}
              placeholder="1"
              value={tokenId}
              onChange={e => setTokenId(e.target.value)}
            />
          </ListGroupItem>
        </ListGroup>
        <VerticalContainer style={{ marginTop: 35, alignItems: "center" }}>
          <div
            style={{ width: "100%", display: "flex", gridGap: 15 }}
            id={"submitBidButton"}
          >
            <Button
              disabled={!account || isPending}
              style={{ width: "100%" }}
              type="submit"
            >
              {isPending ? "Pending..." : "Bid"}
            </Button>
            <Button
              disabled={!account || isPendingClaim}
              style={{ width: "100%" }}
              onClick={async () => {
                await onClaim()
              }}
            >
              {isPendingClaim ? "Pending..." : "Claim Previous Bid"}
            </Button>
          </div>
          <Tooltip
            open={isToolTipOpen}
            target="#submitBidButton"
            disabled={(account !== null && account !== undefined) || isPending}
            toggle={() => setIsToolTipOpen(!isToolTipOpen)}
            placement={"right"}
          >
            Connect your wallet to bid
          </Tooltip>
        </VerticalContainer>
      </Form>
    </>
  )
}

export default RightSection
