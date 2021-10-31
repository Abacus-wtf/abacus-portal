import React, {useState, useEffect} from 'react';
import {ButtonsWhite} from '@components/Button'
import {HorizontalListGroup} from '@components/ListGroupMods'
import {ListGroupItem, Tooltip} from 'shards-react'
import {InputWithTitle} from '@components/Input'
import styled from 'styled-components'
import {useActiveWeb3React} from '@hooks/index'
import {web3} from '@config/constants'
import { useSelector } from "react-redux"
import { AppState } from "@state/index"

const HorizontalListGroupModified = styled(HorizontalListGroup)`
  .list-group-item {
    border-bottom-left-radius: 0px !important;
    border-bottom-right-radius: 0px !important;
    border-bottom: none;
  }
`

interface HashSystem {
  onCreateHash: (appraisalValue: number, password: number) => void
}

export default ({ onCreateHash }: HashSystem) => {
  const [isAppraisalValid, setIsAppraisalValid] = useState(true)
  const [isPasswordValid, setIsPasswordValid] = useState(true)
  const [isToolTipOpen, setIsToolTipOpen] = useState(false)
  const [appraisalValue, setAppraisalValue] = useState('')
  const [passwordValue, setPasswordValue] = useState('')
  const {account} = useActiveWeb3React()
  const sessionData = useSelector<
    AppState,
    AppState["sessionData"]["currentSessionData"]["sessionData"]
  >(state => state.sessionData.currentSessionData.sessionData)

  const onSubmit = () => {
    if (!account) return

    if (isNaN(Number(appraisalValue))) {
      setIsAppraisalValid(false)
      return
    }

    if (isNaN(Number(passwordValue))) {
      setIsPasswordValid(true)
      return
    }
    setIsAppraisalValid(true)
    setIsPasswordValid(true)

    const hash = web3.eth.abi.encodeParameters(['address','uint256','uint256'], [sessionData.address, Number(sessionData.tokenId), sessionData.nonce])
    localStorage.setItem(hash, JSON.stringify({appraisal: Number(appraisalValue), password: Number(passwordValue)}))
    onCreateHash(Number(appraisalValue), Number(passwordValue))
  }

  useEffect(() => {
    const hash = web3.eth.abi.encodeParameters(['address','uint256','uint256'], [sessionData.address, Number(sessionData.tokenId), sessionData.nonce])
    const itemsString = localStorage.getItem(hash)
    if (itemsString !== null && account) {
      const items = JSON.parse(itemsString)
      setPasswordValue(items.password)
      setAppraisalValue(items.appraisal)
      onCreateHash(Number(appraisalValue), Number(passwordValue))
    }
  }, [account])

  return (
    <div>
        <HorizontalListGroupModified>
          <ListGroupItem>
            <InputWithTitle 
                title={'Appraisal Value'}
                id={'appraisalValue'}
                placeholder="5"
                invalid={!isAppraisalValid}
                value={appraisalValue}
                onChange={(e) => setAppraisalValue(e.target.value)}
              />
          </ListGroupItem>
          <ListGroupItem style={{display: 'flex', alignItems: 'center'}}>
            <div>
              <InputWithTitle 
                  title={'Seed'}
                  id={'password'}
                  placeholder="5"
                  value={passwordValue}
                  invalid={!isPasswordValid}
                  onChange={(e) => setPasswordValue(e.target.value)}
                />
            </div>
            <ButtonsWhite id={'hashButton'} style={{maxHeight: 40}} disabled={appraisalValue === '' || passwordValue === ''} onClick={onSubmit}>Hash</ButtonsWhite>
          </ListGroupItem>
        </HorizontalListGroupModified>
        {!account && (
          <Tooltip
            open={isToolTipOpen}
            target="#hashButton"
            toggle={() => setIsToolTipOpen(!isToolTipOpen)}
            placement={"right"}
          >
            Please connect your wallet to hash your appraisal!
          </Tooltip>
        )}
    </div>
  )
}
