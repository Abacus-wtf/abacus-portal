import React, { useEffect, useState } from "react"
import { useWeb3React } from "@web3-react/core"
import { InjectedConnector } from "@web3-react/injected-connector"

function MetamaskProvider({
  children,
}: {
  children: JSX.Element
}): JSX.Element {
  const [injectedConnector] = useState(
    () =>
      new InjectedConnector({
        supportedChainIds: [1, 3, 4, 5, 42, 56, 137, 42161, 421611, 80001],
      })
  )
  const {
    active: networkActive,
    error: networkError,
    activate: activateNetwork,
  } = useWeb3React()
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    injectedConnector
      .isAuthorized()
      .then((isAuthorized) => {
        setLoaded(true)
        if (isAuthorized && !networkActive && !networkError) {
          activateNetwork(injectedConnector)
        }
      })
      .catch(() => {
        setLoaded(true)
      })
  }, [activateNetwork, injectedConnector, networkActive, networkError])
  if (loaded) {
    return children
  }
  return <>Loading</>
}

export default MetamaskProvider
