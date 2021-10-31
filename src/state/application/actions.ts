import { createAction } from "@reduxjs/toolkit"

export const toggleWalletModal = createAction<boolean>(
  "application/toggleWalletModal"
)
