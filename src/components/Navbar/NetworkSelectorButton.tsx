import styled from "styled-components"
import React, { useState } from "react"
import { Modal, ModalBody } from "shards-react"
import {
  NetworkInfoMap,
  NetworkInfo,
  NetworkSymbolAndId,
  ETH_RPC,
} from "@config/constants"
import { useActiveWeb3React } from "@hooks/index"
import { useGetCurrentNetwork } from "@state/application/hooks"
import { Activity } from "react-feather"
import Button from "../Button"

const StyledMenuButton = styled.button`
  position: relative;
  width: auto;
  border: none;
  margin: 0;
  padding: 0;
  white-space: nowrap;
  background-color: #fff;
  border: ${({ theme }) => `1px solid ${theme.primary1}`};
  color: ${({ theme }) => theme.primary1};
  opacity: 1;
  font-weight: 700;
  border-radius: 4px;
  transition: opacity 0.3s;
  height: 44px;
  margin-bottom: 10px;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    opacity: 0.8;
  }

  @media ${({ theme }) => theme.mediaMin.splitCenter} {
    margin-bottom: 0;
    padding: 0.15rem 0.5rem;
    height: 100%;
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
  opacity: 1;

  &:hover {
    opacity: 0.8;
  }
`

const NetworkSelectorButton = () => {
  const { chainId } = useActiveWeb3React()
  const networkSymbol = useGetCurrentNetwork()

  const [showModal, setShowModal] = useState<boolean>(false)

  const { ethereum } = window as any

  const MetamaskRequest = async (network: NetworkInfo) => {
    if (network.chainId === 1) {
      try {
        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x1" }],
        })
        setShowModal(false)
      } catch (error) {
        if (error.code === 4902) {
          try {
            await ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0x1",
                  rpcUrl: [ETH_RPC],
                  chainName: "Ethereum Mainnet",
                  nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
                },
              ],
            })
            setShowModal(false)
          } catch (err) {
            console.log(err, "error on add eth chain")
          }
        }
      }
    } else if (network.chainId === 4) {
      try {
        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x4" }],
        })
        setShowModal(false)
      } catch (error) {
        if (error.code === 4902) {
          try {
            await ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0x4",
                  rpcUrl: [ETH_RPC],
                  chainName: "Rinkeby Test Network",
                  nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
                },
              ],
            })
            setShowModal(false)
          } catch (err) {
            console.log(err, "error on add eth chain")
          }
        }
      }
    } else {
      ethereum
        .request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: `0x${network.chainId.toString(16)}`,
              chainName: network.network,
              nativeCurrency: {
                name: network.symbol,
                symbol: network.symbol,
                decimals: 18,
              },
              rpcUrls: [network.rpc],
              blockExplorerUrls: [network.blockExplorer],
            },
          ],
        })
        .then(() => setShowModal(false))
    }
  }
  return (
    <>
      <StyledMenuButton onClick={() => setShowModal(!showModal)}>
        <Aligner>
          {networkSymbol ? (
            <img
              alt=""
              src={require(`../../images/${networkSymbol}.svg`)}
              style={{ marginRight: "10px", height: "18px", width: "auto" }}
            />
          ) : (
            <Activity
              style={{ marginRight: "10px", height: "18px", width: "auto" }}
            />
          )}
          {networkSymbol || "Change Network"}
        </Aligner>
      </StyledMenuButton>
      <Modal
        size="md"
        open={showModal}
        toggle={() => setShowModal(!showModal)}
        centered
      >
        <ModalBody>
          <AlignerColumn>
            <h4>Select network</h4>
            <Aligner>
              {NetworkInfoMap.map((network) => (
                <NetworkButton
                  key={network.chainId}
                  disabled={network.chainId === chainId}
                  onClick={() => MetamaskRequest(network)}
                >
                  <Aligner>
                    <img
                      alt=""
                      src={require(`../../images/${network.logo}`)}
                      style={{ paddingRight: "10px", height: "18px" }}
                    />
                    {NetworkSymbolAndId[network.chainId]}
                  </Aligner>
                </NetworkButton>
              ))}
            </Aligner>
          </AlignerColumn>
        </ModalBody>
      </Modal>
    </>
  )
}

export default NetworkSelectorButton
