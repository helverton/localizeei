import { AppProps } from 'next/app'
import Head from 'next/head'
import '@/styles/index.css'
import { AuthContextProvider } from '@/contexts/AuthContext'
import { ProfileContextProvider } from '@/contexts/ProfileContext'
import { FilterContextProvider } from '@/contexts/FilterContext'
import { CardContextProvider } from '@/contexts/CardContext'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/localizeei.jpg" type="image/x-icon" />
        <title>Localizeei</title>
      </Head>
      <AuthContextProvider>
        {/* <ProfileContextProvider> */}
          <FilterContextProvider>
            <CardContextProvider>
              <Component {...pageProps} />
            </CardContextProvider>
          </FilterContextProvider>
        {/* </ProfileContextProvider> */}
      </AuthContextProvider>
    </>
  )
}

export default MyApp
