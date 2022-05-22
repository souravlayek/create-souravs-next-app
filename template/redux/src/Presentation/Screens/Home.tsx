import { loginUser } from 'Application'
import { useAppDispatch, useAppSelector } from 'Application'
import React, { useEffect } from 'react'

const Home: React.FC = () => {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state: any) => state.user)
  useEffect(() => {
    dispatch(
      loginUser({
        email: 'sam@kold.com',
        password: 'password2',
      })
    )
  }, [])

  return (
    <div>
      {JSON.stringify(user, null, 2)}
      <h1>You have a clean folder structure</h1>
      <h2>Read the readme.md for better understanding of every section and what you have</h2>
    </div>
  )
}

export default Home
