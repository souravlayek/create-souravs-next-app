import { ReduxWrapper } from 'Application'
import { AppProps } from 'next/app'

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
  return (
    <ReduxWrapper>
      <Component {...pageProps} />
    </ReduxWrapper>
  )
}

export default App
