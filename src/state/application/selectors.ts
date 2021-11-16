import { AppState } from "@state/index"

export const networkSymbolSelector = (
  state: AppState
): AppState["application"]["networkSymbol"] => state.application.networkSymbol
