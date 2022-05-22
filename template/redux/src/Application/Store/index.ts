import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit'
import { userReducer } from './Slice'

const store = configureStore({
  reducer: {
    user: userReducer,
  },
})

export default store
export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
export { default as ReduxWrapper } from './ReduxWrapper'
export * from './Slice'
export * from './ReduxWrapper'
export * from './storeHook'
