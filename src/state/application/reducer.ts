import { createReducer } from "@reduxjs/toolkit"
import { toggleWalletModal } from "./actions"
import _ from "lodash"

interface ApplicationState {
  isWalletModalOpen: boolean
}

export const initialState: ApplicationState = {
  isWalletModalOpen: false,
}

export default createReducer(initialState, builder =>
  builder.addCase(toggleWalletModal, (state, action) => {
    state.isWalletModalOpen = action.payload
  })
)
