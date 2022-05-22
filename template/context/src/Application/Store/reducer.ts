import { counterActionTypes } from './Types'

const mainReducer = (state = 0, action: PayloadAction<number>) => {
  switch (action.type) {
    case counterActionTypes.INCREMENT:
      return state + 1
    case counterActionTypes.DECREMENT:
      return state - 1
    default:
      return state
  }
}

export default mainReducer
