import { AppState } from "@state/index"
import { NetworkSymbolEnum } from "@config/constants"

export const networkSymbolSelector = (
  state: AppState
): AppState["application"]["networkSymbol"] =>
  state?.application?.networkSymbol ?? NetworkSymbolEnum.ETH
