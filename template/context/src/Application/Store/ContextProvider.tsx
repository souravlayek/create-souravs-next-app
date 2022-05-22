import React, { createContext, useContext, useReducer } from 'react'

import { mainReducer } from '.'

const StoreContext = createContext<any>(null)

type Props = {
  children: React.ReactNode
}

const ContextProvider: React.FC<Props> = ({ children }: Props) => {
  const [state, dispatch] = useReducer(mainReducer, 0)
  return <StoreContext.Provider value={[state, dispatch]}>{children}</StoreContext.Provider>
}

export default ContextProvider
export const useMyContext = (): any => useContext(StoreContext)
