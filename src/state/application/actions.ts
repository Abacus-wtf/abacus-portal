import { NetworkSymbolEnum } from "@config/constants"
import { createAction } from "@reduxjs/toolkit"
import { AppState } from ".."

export const toggleWalletModal = createAction<boolean>(
  "application/toggleWalletModal"
)
export const selectNetwork = createAction<NetworkSymbolEnum>(
  "application/selectNetwork"
)
export const setGeneralizedContractErrorMessage = createAction<
  AppState["application"]["generalizedContract"]["errorMessage"]
>("application/generalizedContract/errorMessage")
