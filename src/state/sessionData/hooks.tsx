import { useCallback } from "react"
import { AppState } from "@state/index"
import { useDispatch, useSelector } from "react-redux"
import { getMultipleSessionData, getCurrentSessionData } from "./actions"
import { SessionData } from "./reducer"
import { getCurrentSessionState } from "./selectors"

import { AppDispatch } from "../index"

export const useGetMultiSessionData = () => {
  const dispatch = useDispatch<AppDispatch>()

  return useCallback(async () => {
    const sessionData: SessionData[] = [
      {
        img:
          "https://static01.nyt.com/images/2021/03/12/arts/11nft-auction-cryptopunks-print/11nft-auction-cryptopunks-print-mobileMasterAt3x.jpg",
        endTime: Date.now() + 50000000,
        numPpl: 25,
        title: "Cyber Cities",
        totalStaked: 25,
        nftName: "Gen 3",
        address: "0x",
        tokenId: "110",
        owner: "Medici",
        state: 0,
      },
      {
        img:
          "https://static01.nyt.com/images/2021/03/12/arts/11nft-auction-cryptopunks-print/11nft-auction-cryptopunks-print-mobileMasterAt3x.jpg",
        endTime: Date.now() + 50000000,
        numPpl: 25,
        title: "Cyber Cities",
        totalStaked: 25,
        nftName: "Gen 3",
        address: "0x",
        tokenId: "110",
        owner: "Medici",
        state: 0,
      },
      {
        img:
          "https://static01.nyt.com/images/2021/03/12/arts/11nft-auction-cryptopunks-print/11nft-auction-cryptopunks-print-mobileMasterAt3x.jpg",
        endTime: Date.now() + 50000000,
        numPpl: 25,
        title: "Cyber Cities",
        totalStaked: 25,
        nftName: "Gen 3",
        address: "0x",
        tokenId: "110",
        owner: "Medici",
        state: 0,
      },
      {
        img:
          "https://static01.nyt.com/images/2021/03/12/arts/11nft-auction-cryptopunks-print/11nft-auction-cryptopunks-print-mobileMasterAt3x.jpg",
        endTime: Date.now() + 50000000,
        numPpl: 25,
        title: "Cyber Cities",
        totalStaked: 25,
        nftName: "Gen 3",
        address: "0x",
        tokenId: "110",
        owner: "Medici",
        state: 0,
      },
      {
        img:
          "https://static01.nyt.com/images/2021/03/12/arts/11nft-auction-cryptopunks-print/11nft-auction-cryptopunks-print-mobileMasterAt3x.jpg",
        endTime: Date.now() + 50000000,
        numPpl: 25,
        title: "Cyber Cities",
        totalStaked: 25,
        nftName: "Gen 3",
        address: "0x",
        tokenId: "110",
        owner: "Medici",
        state: 0,
      },
      {
        img:
          "https://static01.nyt.com/images/2021/03/12/arts/11nft-auction-cryptopunks-print/11nft-auction-cryptopunks-print-mobileMasterAt3x.jpg",
        endTime: Date.now() + 50000000,
        numPpl: 25,
        title: "Cyber Cities",
        totalStaked: 25,
        nftName: "Gen 3",
        address: "0x",
        tokenId: "110",
        owner: "Medici",
        state: 0,
      },
      {
        img:
          "https://static01.nyt.com/images/2021/03/12/arts/11nft-auction-cryptopunks-print/11nft-auction-cryptopunks-print-mobileMasterAt3x.jpg",
        endTime: Date.now() + 50000000,
        numPpl: 25,
        title: "Cyber Cities",
        totalStaked: 25,
        nftName: "Gen 3",
        address: "0x",
        tokenId: "110",
        owner: "Medici",
        state: 0,
      },
    ]
    dispatch(getMultipleSessionData(sessionData))
  }, [dispatch])
}

export const useGetCurrentSessionData = () => {
  const dispatch = useDispatch<AppDispatch>()

  return useCallback(async () => {
    const sessionData: SessionData = {
      img:
        "https://static01.nyt.com/images/2021/03/12/arts/11nft-auction-cryptopunks-print/11nft-auction-cryptopunks-print-mobileMasterAt3x.jpg",
      endTime: Date.now() + 50000000,
      numPpl: 25,
      title: "Cyber Cities",
      totalStaked: 25,
      nftName: "Gen 3",
      address: "0x",
      tokenId: "110",
      owner: "Medici",
      totalStakedInUSD: 65000,
      state: 0,
    }

    dispatch(getCurrentSessionData(sessionData))
  }, [dispatch])
}

export const useCurrentSessionState = () => {
  return useSelector<AppState, AppState["sessionData"]["currentSessionData"]>(
    getCurrentSessionState
  )
}
