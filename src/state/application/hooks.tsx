import {useCallback} from 'react'
import {
  setIsNavBarOpen
} from './actions'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../index'

export const useSetIsNavBarOpen = () => {
  const dispatch = useDispatch<AppDispatch>()

  return useCallback(async (isNavBarOpen: boolean) => {
    dispatch(setIsNavBarOpen(isNavBarOpen))
  }, [dispatch])
}