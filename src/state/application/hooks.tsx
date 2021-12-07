import { useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { NetworkSymbolEnum } from "@config/constants"
import { AppDispatch, AppState } from "../index"
import { toggleWalletModal, selectNetwork } from "./actions"
import {
  generalizedContractErrorMessageSelector,
  networkSymbolSelector,
} from "./selectors"

export const useToggleWalletModal = () => {
  const isWalletModalOpen = useSelector<
    AppState,
    AppState["application"]["isWalletModalOpen"]
  >((state) => state.application.isWalletModalOpen)
  const dispatch = useDispatch<AppDispatch>()

  return useCallback(async () => {
    dispatch(toggleWalletModal(!isWalletModalOpen))
  }, [dispatch, isWalletModalOpen])
}

export const useSelectNetwork = () => {
  const dispatch = useDispatch<AppDispatch>()

  return useCallback(
    async (networkChoice: NetworkSymbolEnum) => {
      dispatch(selectNetwork(networkChoice))
    },
    [dispatch]
  )
}

export const useGetCurrentNetwork = () =>
  useSelector<AppState, AppState["application"]["networkSymbol"]>(
    networkSymbolSelector
  )

export const useGeneralizedContractError = () =>
  useSelector<
    AppState,
    AppState["application"]["generalizedContract"]["errorMessage"]
  >(generalizedContractErrorMessageSelector)
