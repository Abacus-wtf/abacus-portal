import { useCallback } from "react"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../index"
import { toggleWalletModal, selectNetwork } from "./actions"
import { useSelector } from "react-redux"
import { AppState } from "../"
import { NetworkSymbolEnum } from "@config/constants"
import { networkSymbolSelector } from "./selectors"

export const useToggleWalletModal = () => {
  const isWalletModalOpen = useSelector<
    AppState,
    AppState["application"]["isWalletModalOpen"]
  >(state => state.application.isWalletModalOpen)
  const dispatch = useDispatch<AppDispatch>()

  return useCallback(async () => {
    dispatch(toggleWalletModal(!isWalletModalOpen))
  }, [dispatch, isWalletModalOpen])
}

export const useSelectNetwork = () => {
  const dispatch = useDispatch<AppDispatch>()

  return useCallback(
    async (networkChoice: NetworkSymbolEnum) => {
      dispatch(selectNetwork({ networkSymbol: networkChoice }))
    },
    [dispatch]
  )
}

export const useGetCurrentNetwork = () =>
  useSelector<AppState, AppState["application"]["networkSymbol"]>(
    networkSymbolSelector
  )
