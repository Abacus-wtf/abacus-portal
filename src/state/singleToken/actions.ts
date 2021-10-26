import { createAction } from '@reduxjs/toolkit'
import {Token} from './reducer'

export const setSingleTokenMetadata = createAction<Token>('singleToken/setMetadata')