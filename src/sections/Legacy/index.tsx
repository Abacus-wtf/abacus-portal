import React, { FunctionComponent, useState, useEffect } from "react"
import Button from "@components/Button"
import { HorizontalListGroup } from "@components/ListGroupMods"
import { ListGroupItem } from "shards-react"
import { InputWithTitle } from "@components/Input"
import { useOnClaimPayout, useOnClaimPrincipalAmount } from "@hooks/claim-pool"
import { useSetPayoutData, useClaimPayoutData } from "@state/miscData/hooks"
import { useActiveWeb3React } from "@hooks/index"
import { SmallUniversalContainer, Title } from "@components/global.styles"
import ConnectWalletAlert from "@components/ConnectWalletAlert"
import styled from "styled-components"
import { useGetCurrentNetwork } from "@state/application/hooks"
import { VerticalContainer } from "../CurrentSession/CurrentSession.styles"

const MaxWidthItem = styled(ListGroupItem)`
  width: 100%;
`

const Legacy: FunctionComponent = () => {
  const { account } = useActiveWeb3React()
  const [ethWithdrawalVal, setEthWithdrawalVal] = useState("")
  const [abcWithdrawalVal, setAbcWithdrawalVal] = useState("")
  const [claimPrincipalVal, setClaimPrincipalVal] = useState("")
  const [isEthButtonTrigger, setIsEthButtonTrigger] = useState(true)
  const [isLoading, setLoading] = useState(false)
  const networkSymbol = useGetCurrentNetwork()

  const claimData = useClaimPayoutData()
  const setPayoutData = useSetPayoutData(true)

  const { onClaim, isPending } = useOnClaimPayout(true)
  const { onClaimPrincipal, isPending: isPendingClaimPrincipal } =
    useOnClaimPrincipalAmount(true)

  const isEthPending = isPending && isEthButtonTrigger
  const isAbcPending = isPending && !isEthButtonTrigger

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await setPayoutData(account)
      setLoading(false)
    }
    if (
      account !== null &&
      account !== undefined &&
      claimData === null &&
      networkSymbol !== null
    ) {
      loadData()
    }
  }, [account, claimData, networkSymbol, setPayoutData])

  if (!account) {
    return (
      <SmallUniversalContainer
        style={{ alignItems: "center", justifyContent: "center" }}
      >
        <ConnectWalletAlert />
      </SmallUniversalContainer>
    )
  }

  if (isLoading || claimData === null) {
    return (
      <SmallUniversalContainer
        style={{ alignItems: "center", justifyContent: "center" }}
      >
        Loading... {/* TODO: find a loader */}
      </SmallUniversalContainer>
    )
  }

  return (
    <SmallUniversalContainer style={{ alignItems: "center" }}>
      <VerticalContainer style={{ maxWidth: 800 }}>
        <Title>Claim Principal</Title>
        <HorizontalListGroup>
          <MaxWidthItem>
            <InputWithTitle
              title="Current Credit"
              id="ethCredit"
              placeholder="0"
              value={`${claimData.ethCredit} ETH`}
              disabled
            />
          </MaxWidthItem>
        </HorizontalListGroup>
        <ListGroupItem>
          <InputWithTitle
            title="Claim Principal"
            id="claimPrincipal"
            placeholder="0"
            value={claimPrincipalVal}
            onChange={(e) => setClaimPrincipalVal(e.target.value)}
          />
        </ListGroupItem>
        <VerticalContainer style={{ alignItems: "center" }}>
          <HorizontalListGroup>
            <div
              style={{ padding: "0 8px", width: "100%" }}
              id="claimPrincipalAmount"
            >
              <Button
                disabled={
                  isPendingClaimPrincipal ||
                  claimPrincipalVal === "" ||
                  Number.isNaN(Number(claimPrincipalVal))
                }
                style={{ width: "100%" }}
                type="button"
                onClick={() => {
                  onClaimPrincipal(claimPrincipalVal)
                }}
              >
                {isPendingClaimPrincipal
                  ? "Pending..."
                  : "Claim Principal Amount"}
              </Button>
            </div>
          </HorizontalListGroup>
        </VerticalContainer>
        <Title style={{ marginTop: "35px !important" }}>Claim Rewards</Title>
        <HorizontalListGroup>
          <MaxWidthItem>
            <InputWithTitle
              title="ETH Payout"
              id="ethPayout"
              placeholder="0"
              value={claimData.ethPayout}
              disabled
            />
          </MaxWidthItem>
          <MaxWidthItem>
            <InputWithTitle
              title="ABC Payout"
              id="abcPayout"
              placeholder="0"
              value={claimData.abcPayout}
              disabled
            />
          </MaxWidthItem>
        </HorizontalListGroup>
        <HorizontalListGroup>
          <MaxWidthItem>
            <InputWithTitle
              title="ETH Withdrawal Amount"
              id="ethWithdrawal"
              placeholder="0"
              value={ethWithdrawalVal}
              onChange={(e) => setEthWithdrawalVal(e.target.value)}
            />
          </MaxWidthItem>
          <MaxWidthItem>
            <InputWithTitle
              title="ABC Withdrawal Amount"
              id="abcWithdrawal"
              placeholder="0"
              value={abcWithdrawalVal}
              onChange={(e) => setAbcWithdrawalVal(e.target.value)}
            />
          </MaxWidthItem>
        </HorizontalListGroup>
        <VerticalContainer style={{ marginTop: 35, alignItems: "center" }}>
          <HorizontalListGroup>
            <div
              style={{ padding: "0 8px", width: "100%" }}
              id="claimEthButton"
            >
              <Button
                disabled={
                  isEthPending ||
                  ethWithdrawalVal === "" ||
                  Number.isNaN(Number(ethWithdrawalVal))
                }
                style={{ width: "100%" }}
                type="button"
                onClick={() => {
                  onClaim(true, ethWithdrawalVal)
                  setIsEthButtonTrigger(true)
                }}
              >
                {isEthPending ? "Pending..." : "Claim ETH"}
              </Button>
            </div>
            <div
              style={{ padding: "0 8px", width: "100%" }}
              id="claimAbcButton"
            >
              <Button
                disabled={
                  isAbcPending ||
                  abcWithdrawalVal === "" ||
                  Number.isNaN(Number(abcWithdrawalVal))
                }
                style={{ width: "100%" }}
                type="button"
                onClick={() => {
                  onClaim(false, abcWithdrawalVal)
                  setIsEthButtonTrigger(false)
                }}
              >
                {isAbcPending ? "Pending..." : "Claim ABC"}
              </Button>
            </div>
          </HorizontalListGroup>
        </VerticalContainer>
      </VerticalContainer>
    </SmallUniversalContainer>
  )
}

export default Legacy