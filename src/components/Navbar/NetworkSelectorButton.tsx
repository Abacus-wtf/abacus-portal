import styled from "styled-components";
import React, { useState } from 'react'
import { useSelector } from "react-redux";
import { AppState } from "../../state";
import { Modal, ModalBody } from "shards-react"
import { NetworkInfoMap, NetworkInfo, NetworkSymbolAndId } from "@config/constants";
import Button from '../Button'
import { ETH_RPC } from "@config/constants";
import { useActiveWeb3React } from "@hooks/index"
import { useGetCurrentNetwork } from '@state/application/hooks'

const StyledMenuButton = styled.button`
  position: relative;
  width: auto;
  height: 100%;
  border: none;
  margin: 0;
  padding: 0;
  white-space: nowrap;
  background-color: #fff;
  border: ${({ theme }) => `1px solid ${theme.primary1}`}
  color: ${({ theme }) => theme.primary1};
  opacity: 1;
  font-weight: 700;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  transition: opacity 0.3s;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    opacity: 0.8;
  }
  `

const Aligner = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
 `

const AlignerColumn = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: column;
 `


const NetworkButton = styled(Button)`
  width: 40%;
  align-self: center;
  align-items: center;
  alignment-baseline: center;
  margin: 20px;
  text-align: center;
  border-radius: 4px;
  transition: 0.3s;
  opacity: 1.0;

  &:hover {
    opacity: 0.8;
  }
`

const NetworkSelectorButton = () => {
  const { account, chainId, library } = useActiveWeb3React()
  const networkSymbol = useGetCurrentNetwork()

  const [showModal, setShowModal] = useState<boolean>(false);

  const { ethereum } = window as any

  const MetamaskRequest = async (network: NetworkInfo) => {
    if (network.chainId === 1) {
      try {
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x1' }],
        });
        setShowModal(false)

      } catch (error) {
        if (error.code === 4902) {
          try {
            await ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0x1',
                rpcUrl: [ETH_RPC],
                chainName: 'Ethereum Mainnet',
                nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
              }],
            })
            setShowModal(false)
          } catch (err) {
            console.log(err, 'error on add eth chain')
          }
        }
      }
    } else {
      ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0x' + network.chainId.toString(16),
          chainName: network.network,
          nativeCurrency: { name: network.symbol, symbol: network.symbol, decimals: 18 },
          rpcUrls: [network.rpc],
          blockExplorerUrls: [network.blockExplorer]
        }]
      }).then(() => setShowModal(false))
    }
  }
  return (
    <>
      <StyledMenuButton onClick={() => setShowModal(!showModal)}>
        <Aligner>
          {networkSymbol !== undefined ? <img src={require(`../../images/${networkSymbol}.svg`)} style={{ marginRight: '10px', height: '18px', width: 'auto' }} /> : null}
          {networkSymbol}
        </Aligner>
      </StyledMenuButton>
      <Modal
        size="md"
        open={showModal}
        toggle={() => setShowModal(!showModal)}
        centered={true}>
          <ModalBody>
            <AlignerColumn>
              <h4>Select network</h4>
              <Aligner>
                {NetworkInfoMap.map((network, index) => {
                  return (
                    <NetworkButton key={index} disabled={network.chainId === chainId} onClick={() => MetamaskRequest(network)}>
                      <Aligner>
                        <img src={require(`../../images/${network.logo}`)} style={{ paddingRight: '10px', height: '18px' }} />
                        {NetworkSymbolAndId[network.chainId]}
                      </Aligner>

                    </NetworkButton>
                  )
                })}

              </Aligner>
            </AlignerColumn>
          </ModalBody>
      </Modal>
    </>

  )
};

export default NetworkSelectorButton