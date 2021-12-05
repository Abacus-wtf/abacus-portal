import { configureStore } from "@reduxjs/toolkit"
import application from "./application/reducer"
import sessionData from "./sessionData/reducer"
import transactions from "./transactions/reducer"
import miscData from "./miscData/reducer"

const store = configureStore({
  reducer: {
    application,
    sessionData,
    transactions,
    miscData,
  },
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware({
      thunk: false,
      immutableCheck: false,
      serializableCheck: false,
    }),
  ],
})

export default store

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
