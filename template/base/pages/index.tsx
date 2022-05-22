import React, { Fragment } from 'react'
import Head from 'next/head'
import { NextPage } from 'next'
import { HomeScreen } from 'Presentation/Screens'

const HomePage: NextPage = () => {
  return (
    <Fragment>
      <Head>
        <title>Home Page</title>
      </Head>
      <HomeScreen />
    </Fragment>
  )
}

export default HomePage
