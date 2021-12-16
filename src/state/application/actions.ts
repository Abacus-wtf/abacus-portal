import { NetworkSymbolEnum } from "@config/constants"
import { createAction } from "@reduxjs/toolkit"

export const toggleWalletModal = createAction<boolean>(
  "application/toggleWalletModal"
)
export const selectNetwork = createAction<NetworkSymbolEnum>(
  "application/selectNetwork"
)
export const setGeneralizedContractErrorMessage = createAction<string>(
  "application/generalizedContract/errorMessage"
)
