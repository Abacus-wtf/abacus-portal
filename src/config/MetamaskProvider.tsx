import React, { useEffect, useState } from "react"
import { useWeb3React } from "@web3-react/core"
import { InjectedConnector } from "@web3-react/injected-connector"

const MetamaskProvider = ({
  children,
}: {
  children: JSX.Element
}): JSX.Element => {
  const [injectedConnector] = useState(
    () =>
      new InjectedConnector({
        supportedChainIds: [
          /* 1, 3, 5, 42, 56, 137, 80001, */ 4, 42161, 421611,
        ],
      })
  )
  const {
    active: networkActive,
    error: networkError,
    activate: activateNetwork,
  } = useWeb3React()
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    const activate = async () => {
      try {
        setLoaded(true)
        const isAuthorized = await injectedConnector.isAuthorized()
        if (isAuthorized && !networkActive && !networkError) {
          activateNetwork(injectedConnector)
        }
      } catch (e) {
        console.log(e)
      }
    }
    activate()
  }, [activateNetwork, injectedConnector, networkActive, networkError])
  if (loaded) {
    return children
  }
  return <>Loading</>
}

export default MetamaskProvider
