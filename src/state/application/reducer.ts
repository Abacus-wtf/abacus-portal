import { createReducer } from "@reduxjs/toolkit"
import { toggleWalletModal, selectNetwork } from "./actions"
import _ from "lodash"
import { NetworkSymbolEnum } from "@config/constants"

interface ApplicationState {
  isWalletModalOpen: boolean
  networkSymbol: NetworkSymbolEnum
}

export const initialState: ApplicationState = {
  isWalletModalOpen: false,
  networkSymbol: NetworkSymbolEnum.ETH,
}

export default createReducer(initialState, builder =>
  builder
    .addCase(toggleWalletModal, (state, action) => {
      state.isWalletModalOpen = action.payload
    })
    .addCase(selectNetwork, (state, action) => {
      state.networkSymbol = action.payload
    })
)
