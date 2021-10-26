import { createReducer } from '@reduxjs/toolkit'
import {
  setIsNavBarOpen
} from './actions'
import _ from 'lodash'

interface ApplicationState {
  isNavBarOpen: boolean
}

export const initialState: ApplicationState = {
    isNavBarOpen: false
}

export default createReducer(initialState, builder =>
  builder
    .addCase(setIsNavBarOpen, (state, action) => {
      state.isNavBarOpen = action.payload
    })
)
