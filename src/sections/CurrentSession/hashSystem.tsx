import React, {useState} from 'react';
import {ButtonsWhite} from '@components/Button'
import {HorizontalListGroup} from '@components/ListGroupMods'
import {ListGroupItem, Tooltip} from 'shards-react'
import {InputWithTitle} from '@components/Input'
import styled from 'styled-components'

const HorizontalListGroupModified = styled(HorizontalListGroup)`
  .list-group-item {
    border-bottom-left-radius: 0px !important;
    border-bottom-right-radius: 0px !important;
    border-bottom: none;
  }
`

interface HashSystem {
  onCreateHash: (appraisalValue: number, password: string) => void
}

export default ({onCreateHash}: HashSystem) => {
  const [isAppraisalValid, setIsAppraisalValid] = useState(true)
  const [isToolTipOpen, setIsToolTipOpen] = useState(false)
  const [appraisalValue, setAppraisalValue] = useState('')
  const [passwordValue, setPasswordValue] = useState('')
  const [isConnectedToWallet, ] = useState(true)

  const onSubmit = () => {
    if (!isConnectedToWallet) return

    if (isNaN(Number(appraisalValue))) {
      setIsAppraisalValid(false)
      return
    }
    setIsAppraisalValid(true)

    onCreateHash(Number(appraisalValue), passwordValue)
  }

  return (
    <div>
        <HorizontalListGroupModified>
          <ListGroupItem>
            <InputWithTitle 
                title={'Appraisal Value'}
                id={'appraisalValue'}
                placeholder="0"
                invalid={!isAppraisalValid}
                value={appraisalValue}
                onChange={(e) => setAppraisalValue(e.target.value)}
              />
          </ListGroupItem>
          <ListGroupItem style={{display: 'flex', alignItems: 'center'}}>
            <div>
              <InputWithTitle 
                  title={'Password'}
                  id={'password'}
                  placeholder="Input"
                  value={passwordValue}
                  onChange={(e) => setPasswordValue(e.target.value)}
                />
            </div>
            <ButtonsWhite style={{maxHeight: 40}} disabled={appraisalValue === '' || passwordValue === ''} onClick={onSubmit}>Hash</ButtonsWhite>
          </ListGroupItem>
        </HorizontalListGroupModified>
        {!isConnectedToWallet && 
          <Tooltip
            open={isToolTipOpen}
            target="#hashButton"
            toggle={() => setIsToolTipOpen(!isToolTipOpen)}
            placement={'right'}
          >
            Please connect your wallet to hash your appraisal!
          </Tooltip>}
      </div>
  )
}