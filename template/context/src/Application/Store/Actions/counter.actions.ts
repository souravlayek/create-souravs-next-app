import { counterActionTypes } from '../Types'

export const incrementCount = (): PayloadAction<number> => {
  return {
    type: counterActionTypes.INCREMENT,
  }
}
export const decrementCount = (): PayloadAction<number> => {
  return {
    type: counterActionTypes.DECREMENT,
  }
}
