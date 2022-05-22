import { ContextProvider } from 'Application/Store'
import { AppProps } from 'next/app'

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
  return (
    <ContextProvider>
      <Component {...pageProps} />
    </ContextProvider>
  )
}

export default App
