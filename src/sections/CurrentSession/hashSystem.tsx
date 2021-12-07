import React, { useState, useEffect } from "react"
import { ButtonsWhite } from "@components/Button"
import { ListGroupItem, Tooltip } from "shards-react"
import { InputWithTitle } from "@components/Input"
import { useActiveWeb3React } from "@hooks/index"
import { useCurrentSessionData } from "@state/sessionData/hooks"
import { encodeSessionData } from "@config/utils"
import { HorizontalListGroupModified } from "./CurrentSession.styles"

interface HashSystem {
  onCreateHash: (appraisalValue: number, password: number) => void
}

export default ({ onCreateHash }: HashSystem) => {
  const [isAppraisalValid, setIsAppraisalValid] = useState(true)
  const [isPasswordValid, setIsPasswordValid] = useState(true)
  const [isToolTipOpen, setIsToolTipOpen] = useState(false)
  const [appraisalValue, setAppraisalValue] = useState("")
  const [passwordValue, setPasswordValue] = useState("")
  const { account } = useActiveWeb3React()
  const sessionData = useCurrentSessionData()

  const onSubmit = () => {
    if (!account) return

    if (Number.isNaN(Number(appraisalValue)) || appraisalValue === "") {
      setIsAppraisalValid(false)
      return
    }

    if (Number.isNaN(Number(passwordValue)) || appraisalValue === "") {
      setIsPasswordValid(false)
      return
    }
    setIsAppraisalValid(true)
    setIsPasswordValid(true)

    const encodedVals = encodeSessionData({
      account,
      nftAddress: sessionData.address,
      tokenId: sessionData.tokenId,
      nonce: sessionData.nonce,
    })

    localStorage.setItem(
      encodedVals,
      JSON.stringify({
        password: Number(passwordValue),
        appraisal: Number(appraisalValue),
      })
    )

    onCreateHash(Number(appraisalValue), Number(passwordValue))
  }

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
      setPasswordValue(items.password)
      setAppraisalValue(items.appraisal)
      onCreateHash(Number(items.appraisal), Number(items.password))
    } else if (
      !Number.isNaN(Number(passwordValue)) &&
      !Number.isNaN(Number(appraisalValue)) &&
      appraisalValue !== "" &&
      passwordValue !== ""
    ) {
      onCreateHash(Number(appraisalValue), Number(passwordValue))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    account,
    onCreateHash,
    sessionData.address,
    sessionData.nonce,
    sessionData.tokenId,
  ])

  return (
    <div>
      <HorizontalListGroupModified>
        <ListGroupItem>
          <InputWithTitle
            title="Appraisal Value"
            id="appraisalValue"
            placeholder="5"
            invalid={!isAppraisalValid}
            value={appraisalValue}
            onChange={(e) => setAppraisalValue(e.target.value)}
          />
        </ListGroupItem>
        <ListGroupItem style={{ display: "flex", alignItems: "center" }}>
          <div>
            <InputWithTitle
              title="Seed"
              id="password"
              placeholder="5"
              value={passwordValue}
              invalid={!isPasswordValid}
              onChange={(e) => setPasswordValue(e.target.value)}
            />
          </div>
          <ButtonsWhite
            id="hashButton"
            style={{ maxHeight: 40 }}
            disabled={appraisalValue === "" || passwordValue === ""}
            onClick={onSubmit}
          >
            Hash
          </ButtonsWhite>
        </ListGroupItem>
      </HorizontalListGroupModified>
      {!account && (
        <Tooltip
          open={isToolTipOpen}
          target="#hashButton"
          toggle={() => setIsToolTipOpen(!isToolTipOpen)}
          placement="right"
        >
          Please connect your wallet to hash your appraisal!
        </Tooltip>
      )}
    </div>
  )
}
