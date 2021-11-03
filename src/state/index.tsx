import { configureStore } from "@reduxjs/toolkit"
import { save, load } from "redux-localstorage-simple"
import { createAction } from "@reduxjs/toolkit"
import application from "./application/reducer"
import sessionData from "./sessionData/reducer"
import transactions from "./transactions/reducer"
import auctionData from "./auctionData/reducer"

const PERSISTED_KEYS: string[] = []

export const updateVersion = createAction<void>("global/updateVersion")

const store = configureStore({
  reducer: {
    application,
    sessionData,
    transactions,
    auctionData,
  },
  middleware: getDefaultMiddleware => [
    ...getDefaultMiddleware({
      thunk: false,
      immutableCheck: false,
      serializableCheck: false,
    }),
    save({ states: PERSISTED_KEYS }),
  ],
  preloadedState: load({ states: PERSISTED_KEYS }),
})

export default store

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
