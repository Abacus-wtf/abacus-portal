import { AppState } from "@state/index"

export const networkSymbolSelector = (
  state: AppState
): AppState["application"]["networkSymbol"] => state.application.networkSymbol

export const generalizedContractErrorMessageSelector = (
  state: AppState
): AppState["application"]["generalizedContract"]["errorMessage"] =>
  state.application.generalizedContract.errorMessage
