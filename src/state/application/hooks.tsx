import { useCallback } from "react"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../index"
import { toggleWalletModal } from "./actions"
import { useSelector } from "react-redux"
import { AppState } from "../"

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
