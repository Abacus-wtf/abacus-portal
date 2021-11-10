import React, { useEffect } from "react"
import { AbstractConnector } from "@web3-react/abstract-connector"
import { useSelector } from "react-redux"
import { AppState } from "@state/index"
import { useToggleWalletModal } from "@state/application/hooks"
import { Modal, ModalBody } from "shards-react"
import { SUPPORTED_WALLETS, WalletInfo } from "@config/constants"
import Option from "./Option"
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core"
import _ from "lodash"

export default () => {
  const { active, account, connector, activate, error } = useWeb3React()
  const isWalletModalOpen = useSelector<
    AppState,
    AppState["application"]["isWalletModalOpen"]
  >(state => state.application.isWalletModalOpen)
  const toggleWalletModal = useToggleWalletModal()

  const tryActivation = async (connector: AbstractConnector | undefined) => {
    let name = ""
    Object.keys(SUPPORTED_WALLETS).map(key => {
      if (connector === SUPPORTED_WALLETS[key].connector) {
        return (name = SUPPORTED_WALLETS[key].name)
      }
      return true
    })

    connector &&
      activate(connector, undefined, true)
        .then(() => {
          toggleWalletModal()
        })
        .catch(error => {
          if (error instanceof UnsupportedChainIdError) {
            activate(connector)
          } else {
          }
        })
  }

  return (
    <Modal
      size="md"
      open={isWalletModalOpen}
      toggle={toggleWalletModal}
      centered={true}
    >
      <ModalBody style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: 10}}>
        {_.map(_.keys(SUPPORTED_WALLETS), key => {
          const option = SUPPORTED_WALLETS[key]
          return (
            <Option
              onClick={() => {
                option.connector !== connector &&
                  !option.href &&
                  tryActivation(option.connector)
              }}
              id={`connect-${key}`}
              key={key}
              active={option.connector && option.connector === connector}
              color={option.color}
              link={option.href}
              header={option.name}
              subheader={null}
              icon={require("../../images/" + option.iconName)}
            />
          )
        })}
      </ModalBody>
    </Modal>
  )
}
