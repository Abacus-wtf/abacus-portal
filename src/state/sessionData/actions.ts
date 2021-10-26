import { createAction } from '@reduxjs/toolkit'
import {SessionData} from './reducer'

export const getMultipleSessionData = createAction<SessionData[]>('sessionData/getMultipleSessionData')