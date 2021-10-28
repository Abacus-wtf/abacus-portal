import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core'
import store from "./src/state"
import {Provider} from "react-redux"
import React from 'react'
import { theme } from './src/config/theme'
import { Fragment } from 'react'
import { ThemeProvider } from 'styled-components'
import {NetworkContextName} from '@config/constants'
import { Web3Provider } from '@ethersproject/providers'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'shards-ui/dist/css/shards.min.css'

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName)
const getLibrary = (provider) => {
    const library = new Web3Provider(provider, 'any')
    library.pollingInterval = 15000
    return library
  }
  

export const wrapRootElement = ({ element }) => {
    return (
        <Fragment>
            <Web3ReactProvider getLibrary={getLibrary}>
                <Web3ProviderNetwork getLibrary={getLibrary}>
                    <Provider store={store}>
                        <ThemeProvider theme={theme}>
                            {element}
                        </ThemeProvider>
                    </Provider>
                </Web3ProviderNetwork>
            </Web3ReactProvider>
        </Fragment>
    )
}