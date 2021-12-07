import { useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  ETH_USD_ORACLE_ADDRESS,
  ZERO_ADDRESS,
  ABC_AUCTION_ADDRESS,
  ABC_PRICING_SESSION_ADDRESS,
  ARB_ABC_PRICING_SESSION_ADDRESS_LEGACY,
} from "@config/constants"
import {
  useActiveWeb3React,
  useWeb3Contract,
  useWeb3EthContract,
} from "@hooks/index"
import ABC_AUCTION_ABI from "@config/contracts/ABC_AUCTION_ABI.json"
import { openseaGet } from "@config/utils"
import { formatEther } from "ethers/lib/utils"
import ABC_PRICING_SESSION_ABI from "@config/contracts/ABC_PRICING_SESSION_ABI.json"
import ETH_USD_ORACLE_ABI from "@config/contracts/ETH_USD_ORACLE_ABI.json"
import { useGetCurrentNetwork } from "@state/application/hooks"
import { AppDispatch, AppState } from "../index"
import { AuctionData } from "./reducer"
import { setAuctionData, setClaimData } from "./actions"

export const useSetAuctionData = () => {
  const dispatch = useDispatch<AppDispatch>()
  const getAuctionContract = useWeb3Contract(ABC_AUCTION_ABI)
  const getEthUsdContract = useWeb3EthContract(ETH_USD_ORACLE_ABI)
  const networkSymbol = useGetCurrentNetwork()
  const { account } = useActiveWeb3React()

  return useCallback(async () => {
    const auctionContract = getAuctionContract(
      ABC_AUCTION_ADDRESS(networkSymbol)
    )
    const ethUsdOracle = getEthUsdContract(ETH_USD_ORACLE_ADDRESS)

    let nonce = await auctionContract.methods.nonce().call()
    nonce = Number(nonce)

    const [highestBid, highestBidder, endTime] = await Promise.all([
      auctionContract.methods.highestBid(nonce).call(),
      auctionContract.methods.highestBidder(nonce).call(),
      auctionContract.methods.endTime(nonce).call(),
    ])

    let ethUsd
    try {
      ethUsd = await ethUsdOracle.methods.latestRoundData().call()
      ethUsd = Number(ethUsd.answer) / 100000000
    } catch (e) {
      ethUsd = 4500
    }

    const [highestBidderUserVote, userVote] = await Promise.all([
      auctionContract.methods.userVote(nonce, highestBidder).call(),
      auctionContract.methods.userVote(nonce, account).call(),
    ])
    let optionalInfo
    if (highestBidderUserVote.nftAddress !== ZERO_ADDRESS) {
      const URL = `asset/${highestBidderUserVote.nftAddress}/${highestBidderUserVote.tokenid}`
      const nftMetadata = await openseaGet(URL)

      optionalInfo = {
        image_url: nftMetadata?.image_url || nftMetadata?.image_preview_url,
        animation_url: nftMetadata?.animation_url || null,
        highestBidderAddress: highestBidder,
        highestNftAddress: highestBidderUserVote.nftAddress,
        highestNftTokenId: highestBidderUserVote.tokenid,
        highestNftCollectionTitle: nftMetadata?.collection?.name,
        highestNftName: nftMetadata?.name,
      }
    }

    const auctionData: AuctionData = {
      endTime: Number(endTime) * 1000,
      highestBid: Number(formatEther(highestBid)),
      highestBidDollars: Number(formatEther(highestBid)) * Number(ethUsd),
      optionalInfo,
      existingBidInfo:
        userVote && Number(userVote.bid) !== 0
          ? {
              ...userVote,
              tokenId: userVote.tokenid,
              initialAppraisal: formatEther(userVote.initialAppraisal),
            }
          : undefined,
    }
    dispatch(setAuctionData(auctionData))
  }, [getAuctionContract, networkSymbol, getEthUsdContract, account, dispatch])
}

export const useSetPayoutData = (isLegacy = false) => {
  const dispatch = useDispatch<AppDispatch>()
  const getPricingSessionContract = useWeb3Contract(ABC_PRICING_SESSION_ABI)
  const networkSymbol = useGetCurrentNetwork()

  return useCallback(
    async (account: string) => {
      const pricingSessionContract = getPricingSessionContract(
        isLegacy
          ? ARB_ABC_PRICING_SESSION_ADDRESS_LEGACY
          : ABC_PRICING_SESSION_ADDRESS(networkSymbol)
      )
      const [ethPayout, ethToAbc, principalStored] = await Promise.all([
        pricingSessionContract.methods.profitStored(account).call(),
        pricingSessionContract.methods.ethToAbc().call(),
        pricingSessionContract.methods.principalStored(account).call(),
      ])
      const eth = Number(formatEther(ethPayout))
      const abc = Number(ethToAbc) * Number(formatEther(ethPayout))
      const ethCredit = Number(formatEther(principalStored))
      dispatch(setClaimData({ ethPayout: eth, abcPayout: abc, ethCredit }))
    },
    [getPricingSessionContract, networkSymbol, dispatch, isLegacy]
  )
}

export const useAuctionData = () =>
  useSelector<AppState, AppState["miscData"]["auctionData"]>(
    (state) => state.miscData.auctionData
  )

export const useClaimPayoutData = () =>
  useSelector<AppState, AppState["miscData"]["claimPayoutData"]>(
    (state) => state.miscData.claimPayoutData
  )
