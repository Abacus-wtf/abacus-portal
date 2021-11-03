import React, {
  FormEvent,
  FunctionComponent,
  useContext,
  useState,
  useEffect,
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
import {useSetAuctionData} from '@state/auctionData/hooks'
import { useSelector } from "react-redux"
import { AppState } from "@state/index"
import { InputWithTitle } from "@components/Input"
import { useActiveWeb3React } from "@hooks/index"
import { web3, ZERO_ADDRESS } from "@config/constants"
import {
  useIsTxOccurring,
} from "@state/transactions/hooks"
import _ from "lodash"
import { useOnBid } from "@hooks/auction"

const RightSection: FunctionComponent = () => {
  const { account } = useActiveWeb3React()
  const auctionData = useSelector<
    AppState,
    AppState["auctionData"]["auctionData"]
  >(state => state.auctionData.auctionData)
  const [isToolTipOpen, setIsToolTipOpen] = useState(false)
  const bid = useOnBid()

  const [txHash, setTxHash] = useState()
  const isTxOccurring = useIsTxOccurring(txHash)
  const setAuctionData = useSetAuctionData()

  useEffect(() => {
    if (!isTxOccurring && auctionData !== null) {
      //loadData()
    }
  }, [isTxOccurring])
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
          overrideTitle={'Bidding Ends In'}
        />
      </HorizontalListGroup>
      <Form
        onSubmit={async (e: FormEvent<HTMLDivElement>) => {
          e.preventDefault()
          const cb = hash => {
            setTxHash(hash)
          }
          await bid(
            e.target["bid"].value,
            e.target["initAppraisal"].value,
            e.target["nftAddress"].value,
            e.target["tokenId"].value,
            cb
          )
        }}
      >
        <ListGroup>
          <ListGroupItem>
            <InputWithTitle
              title={"Bid"}
              id={"bid"}
              placeholder="0"
            />
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
            />
          </ListGroupItem>
          <ListGroupItem>
            <InputWithTitle
              title={"Token ID"}
              id={"tokenId"}
              placeholder="1"
            />
          </ListGroupItem>
        </ListGroup>
        <VerticalContainer style={{ marginTop: 35, alignItems: "center" }}>
          <div style={{ width: "100%" }} id={"submitVoteButton"}>
            <Button
              disabled={
                !account ||
                isTxOccurring
              }
              style={{ width: "100%" }}
              type="submit"
            >
              {isTxOccurring
                ? "Pending..."
                : "Bid"}
            </Button>
          </div>
          <Tooltip
            open={isToolTipOpen}
            target="#submitVoteButton"
            disabled={(account !== null && account !== undefined) || isTxOccurring}
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
