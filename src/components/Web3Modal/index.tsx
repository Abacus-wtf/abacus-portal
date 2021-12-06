// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { AbstractConnector } from "@web3-react/abstract-connector"
import React from "react"
import { useSelector } from "react-redux"
import { AppState } from "@state/index"
import { useToggleWalletModal } from "@state/application/hooks"
import { Modal, ModalBody } from "shards-react"
import { SUPPORTED_WALLETS } from "@config/constants"
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core"
import _ from "lodash"
import Option from "./Option"

export default () => {
  const { connector, activate } = useWeb3React()
  const isWalletModalOpen = useSelector<
    AppState,
    AppState["application"]["isWalletModalOpen"]
  >((state) => state.application.isWalletModalOpen)
  const toggleWalletModal = useToggleWalletModal()

  const tryActivation = async (connector: AbstractConnector | undefined) => {
    Object.keys(SUPPORTED_WALLETS).map((key) => {
      if (connector === SUPPORTED_WALLETS[key].connector) {
        return SUPPORTED_WALLETS[key].name
      }
      return true
    })

    // eslint-disable-next-line no-unused-expressions
    connector &&
      activate(connector, undefined, true)
        .then(() => {
          toggleWalletModal()
        })
        .catch((error) => {
          if (error instanceof UnsupportedChainIdError) {
            activate(connector)
          }
        })
  }

  return (
    <Modal
      size="md"
      open={isWalletModalOpen}
      toggle={toggleWalletModal}
      centered
    >
      <ModalBody
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridGap: 10 }}
      >
        {_.map(_.keys(SUPPORTED_WALLETS), (key) => {
          const option = SUPPORTED_WALLETS[key]
          return (
            <Option
              onClick={() => {
                // eslint-disable-next-line no-unused-expressions
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
              icon={require(`../../images/${option.iconName}`)}
            />
          )
        })}
      </ModalBody>
    </Modal>
  )
}
