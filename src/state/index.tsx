import { configureStore } from '@reduxjs/toolkit'
import { save, load } from 'redux-localstorage-simple'
import { createAction } from '@reduxjs/toolkit'
import application from './application/reducer'
import singleToken from './singleToken/reducer'

const PERSISTED_KEYS: string[] = []

export const updateVersion = createAction<void>('global/updateVersion')

const store = configureStore({
  reducer: {
    application,
    singleToken
  },
  middleware: (getDefaultMiddleware) => [...getDefaultMiddleware({ thunk: false, immutableCheck: false, serializableCheck: false }), save({ states: PERSISTED_KEYS })],
  preloadedState: load({ states: PERSISTED_KEYS })
})

export default store

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
