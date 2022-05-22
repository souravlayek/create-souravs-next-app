import React from 'react'
import { Provider } from 'react-redux'
import store from '.'
type Props = {
  children: React.ReactNode
}

const ReduxWrapper: React.FC<Props> = ({ children }: Props) => {
  return <Provider store={store}>{children}</Provider>
}

export default ReduxWrapper
