import { decrementCount, incrementCount, useMyContext } from 'Application'
import React from 'react'

const Home: React.FC = () => {
  const [state, dispatch] = useMyContext()

  const incrementCounter = (): void => {
    dispatch(incrementCount())
  }

  const decrementCounter = (): void => {
    dispatch(decrementCount())
  }

  return (
    <div>
      <h1>You have a clean folder structure</h1>
      <h2>Read the readme.md for better understanding of every section and what you have</h2>
      <hr />
      <h3>Value inside context: {state}</h3>
      <button onClick={incrementCounter}>Increment</button>
      <button onClick={decrementCounter}>Increment</button>
    </div>
  )
}

export default Home
