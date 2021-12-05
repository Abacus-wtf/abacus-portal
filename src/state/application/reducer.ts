import { createReducer } from "@reduxjs/toolkit"
import { NetworkSymbolEnum } from "@config/constants"
import { toggleWalletModal, selectNetwork } from "./actions"

interface ApplicationState {
  isWalletModalOpen: boolean
  networkSymbol: NetworkSymbolEnum | null
}

export const initialState: ApplicationState = {
  isWalletModalOpen: false,
  networkSymbol: null,
}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(toggleWalletModal, (state, action) => {
      state.isWalletModalOpen = action.payload
    })
    .addCase(selectNetwork, (state, action) => {
      state.networkSymbol = action.payload
    })
)
