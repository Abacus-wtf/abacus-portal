import React, { useEffect } from "react"
import { ListGroupItem } from "shards-react"
import { InputWithTitle } from "@components/Input"
import {
  useCurrentSessionData,
  useCurrentSessionUserStatus,
} from "@state/sessionData/hooks"
import { UserState } from "@state/sessionData/reducer"
import { useClaimPayoutData } from "@state/miscData/hooks"
import { useActiveWeb3React } from "@hooks/index"
import { encodeSessionData } from "@config/utils"
import { HorizontalListGroupModified } from "./CurrentSession.styles"

interface HashSystem {
  passwordVal: string
  appraisalVal: string
  stakeVal: string
  setStakeVal: (string) => void
  setPasswordVal: (string) => void
  setAppraisalVal: (string) => void
}

export default ({
  stakeVal,
  setStakeVal,
  appraisalVal,
  passwordVal,
  setPasswordVal,
  setAppraisalVal,
}: HashSystem) => {
  const { account } = useActiveWeb3React()
  const sessionData = useCurrentSessionData()
  const userStatus = useCurrentSessionUserStatus()
  const claimData = useClaimPayoutData()

  useEffect(() => {
    const encodedVals = encodeSessionData({
      account,
      nftAddress: sessionData.address,
      tokenId: sessionData.tokenId,
      nonce: sessionData.nonce,
    })
    const itemsString = localStorage.getItem(encodedVals)
    if (itemsString !== null && account) {
      const items = JSON.parse(itemsString)
      setPasswordVal(items.password)
      setAppraisalVal(items.appraisal)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, sessionData.address, sessionData.nonce, sessionData.tokenId])

  return (
    <div>
      {userStatus !== UserState.CompletedVote ? (
        <HorizontalListGroupModified>
          <ListGroupItem>
            <InputWithTitle
              title="Appraisal Value"
              id="appraisalValue"
              placeholder="5"
              value={appraisalVal}
              onChange={(e) => setAppraisalVal(e.target.value)}
              infoText="Determine what you think this NFT is worth (in ETH) and input it here."
            />
          </ListGroupItem>
          <ListGroupItem>
            <InputWithTitle
              title={`Stake - Max: ${
                !claimData ? "-" : claimData.ethCredit
              } ETH`}
              id="stake"
              value={stakeVal}
              onChange={(e) => setStakeVal(e.target.value)}
              placeholder="0.001"
              infoText="Determine how much ETH you are willing to stake."
            />
          </ListGroupItem>
        </HorizontalListGroupModified>
      ) : (
        <ListGroupItem>
          <InputWithTitle
            title="Appraisal Value"
            id="appraisalValue"
            placeholder="5"
            value={appraisalVal}
            onChange={(e) => setAppraisalVal(e.target.value)}
            infoText="Determine what you think this NFT is worth (in ETH) and input it here."
          />
        </ListGroupItem>
      )}
      <ListGroupItem
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <InputWithTitle
          title="Password (Number)"
          id="password"
          placeholder="5"
          value={passwordVal}
          onChange={(e) => setPasswordVal(e.target.value)}
          infoText="Input a random seed number so that we can effectively hide your appraisal value. This will be used later during reveal so make sure you remember this number!"
        />
      </ListGroupItem>
    </div>
  )
}
