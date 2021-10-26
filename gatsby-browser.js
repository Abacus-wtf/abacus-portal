import store from "./src/state"
import {Provider} from "react-redux"
import React from 'react'
import { theme } from './src/config/theme'
import { Fragment } from 'react'
import { ThemeProvider } from 'styled-components'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'shards-ui/dist/css/shards.min.css'

export const wrapRootElement = ({ element }) => {
    return (
        <Fragment>
            <Provider store={store}>
                <ThemeProvider theme={theme}>
                    {element}
                </ThemeProvider>
            </Provider>
        </Fragment>
    )
}