import React, {
  FormEvent,
  FunctionComponent,
  useContext,
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
import { useAuctionData, useSetAuctionData } from "@state/miscData/hooks"
import { InputWithTitle } from "@components/Input"
import { useActiveWeb3React } from "@hooks/index"
import { ZERO_ADDRESS } from "@config/constants"
import { useOnBid, useOnClaim, useOnAddToBid } from "@hooks/auction"
import SessionCountdown from "../CurrentSession/CurrentState/SessionCountdown"
import {
  VerticalContainer,
  ListGroupItemMinWidth,
} from "../CurrentSession/CurrentSession.styles"

const RightSection: FunctionComponent = () => {
  const { account } = useActiveWeb3React()
  const auctionData = useAuctionData()
  const [isToolTipOpen, setIsToolTipOpen] = useState(false)
  const { onBid, isPending } = useOnBid()
  const { onAddToBid, isPending: isPendingAddToBid } = useOnAddToBid()
  const { onClaim, isPending: isPendingClaim } = useOnClaim()
  const [nftAddress, setNftAddress] = useState()
  const [tokenId, setTokenId] = useState()

  const setAuctionData = useSetAuctionData()

  const theme = useContext(ThemeContext)
  return (
    <>
      <HorizontalListGroup>
        <ListGroupItemMinWidth>
          <Label>Highest Bounty</Label>
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
          overrideTitle="Bounty Auction Ends In"
        />
      </HorizontalListGroup>
      <Form
        onSubmit={async (e: FormEvent<HTMLDivElement>) => {
          const target = e.target as any
          e.preventDefault()

          if (Number(target.bid.value) <= auctionData.highestBid) {
            alert(
              `You tried to bid lower than or the same as the highest bid. Please bid higher than ${auctionData.highestBid} Ether.`
            )
            return
          }

          await onBid(
            target.bid.value,
            target.initAppraisal.value,
            target.nftAddress.value,
            target.tokenId.value
          )
        }}
      >
        <ListGroup>
          <ListGroupItem>
            <InputWithTitle title="Bounty" id="bid" placeholder="0" />
          </ListGroupItem>
          <ListGroupItem>
            <InputWithTitle
              title="Initial Appraisal"
              id="initAppraisal"
              placeholder="0.001"
            />
          </ListGroupItem>
          <ListGroupItem>
            <InputWithTitle
              title="NFT Address"
              id="nftAddress"
              placeholder={ZERO_ADDRESS}
              value={nftAddress}
              onChange={(e) => setNftAddress(e.target.value)}
            />
          </ListGroupItem>
          <ListGroupItem>
            <InputWithTitle
              title="Token ID"
              id="tokenId"
              placeholder="1"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
            />
          </ListGroupItem>
        </ListGroup>
        <VerticalContainer style={{ marginTop: 35, alignItems: "center" }}>
          <div
            style={{ width: "100%", display: "flex", gridGap: 15 }}
            id="submitBidButton"
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
            placement="right"
          >
            Connect your wallet to bid
          </Tooltip>
        </VerticalContainer>
      </Form>
      {auctionData.existingBidInfo && (
        <Form
          onSubmit={async (e: FormEvent<HTMLDivElement>) => {
            const target = e.target as any
            e.preventDefault()

            await onAddToBid(
              target.newBid.value,
              target.nftAddressAdd.value,
              target.tokenIdAdd.value
            )
          }}
        >
          <VerticalContainer style={{ marginTop: 35, alignItems: "center" }}>
            <ListGroup style={{ width: "100%" }}>
              <ListGroupItem>
                <InputWithTitle
                  title="Add To Bid"
                  id="newBid"
                  placeholder="0"
                />
              </ListGroupItem>
              <ListGroupItem>
                <InputWithTitle
                  title="NFT Address"
                  id="nftAddressAdd"
                  placeholder={ZERO_ADDRESS}
                  value={auctionData.existingBidInfo.nftAddress}
                  disabled
                />
              </ListGroupItem>
              <ListGroupItem>
                <InputWithTitle
                  title="Token ID"
                  id="tokenIdAdd"
                  placeholder="1"
                  value={auctionData.existingBidInfo.tokenId}
                  disabled
                />
              </ListGroupItem>
              <ListGroupItem>
                <InputWithTitle
                  title="Initial Appraisal"
                  id="initAppraisal"
                  value={auctionData.existingBidInfo.initialAppraisal}
                  disabled
                />
              </ListGroupItem>
            </ListGroup>
            <Button
              disabled={!account || isPendingAddToBid}
              style={{ width: "100%" }}
              type="submit"
            >
              {isPendingAddToBid ? "Pending..." : "Add To Bid"}
            </Button>
          </VerticalContainer>
        </Form>
      )}
    </>
  )
}

export default RightSection
