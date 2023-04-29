import { ReactNode } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import '@/styles/globals.css'

// * MUI Imports
import { ThemeProvider } from '@mui/material/styles'

// ** web3 libs
import { ConnectKitProvider } from 'connectkit'
import { WagmiConfig, createClient, configureChains } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { mainnet, polygon, optimism } from '@wagmi/core/chains'

import { AuthProvider } from '@/context/AuthContext'
import theme from '@/theme'
import MainLayout from '@/layouts/MainLayout'
import GuestGuard from '@/components/auth/GuestGuard'
import AuthGuard from '@/components/auth/AuthGuard'

// ** Spinner Import
import Spinner from '@/components/Spinner'

// Configure chains & providers with the Infura provider
const { chains, provider, webSocketProvider } = configureChains([mainnet, polygon, optimism], [publicProvider()])

// Set up client
const client = createClient({
  autoConnect: false,
  connectors: [
    new MetaMaskConnector({ chains }),
    new InjectedConnector({
      chains,
      options: {
        name: 'Injected',
        shimDisconnect: true
      }
    })
  ],
  provider,
  webSocketProvider
})

type ExtendedAppProps = AppProps & {
  Component: NextPage
}

type GuardProps = {
  authGuard: boolean
  guestGuard: boolean
  children: ReactNode
}

const Guard = ({ children, authGuard, guestGuard }: GuardProps) => {
  if (guestGuard) {
    return <GuestGuard fallback={<Spinner />}>{children}</GuestGuard>
  } else if (!guestGuard && !authGuard) {
    return <>{children}</>
  } else {
    return <AuthGuard fallback={<Spinner />}>{children}</AuthGuard>
  }
}

export default function App({ Component, pageProps }: ExtendedAppProps) {
  const getLayout = Component.getLayout ?? (page => <MainLayout>{page}</MainLayout>)

  const authGuard = Component.authGuard ?? true

  const guestGuard = Component.guestGuard ?? false

  return (
    <AuthProvider>
      <WagmiConfig client={client}>
        <ConnectKitProvider>
          <ThemeProvider theme={theme}>
            <Guard authGuard={authGuard} guestGuard={guestGuard}>
              {getLayout(<Component {...pageProps} />)}
            </Guard>
          </ThemeProvider>
        </ConnectKitProvider>
      </WagmiConfig>
    </AuthProvider>
  )
}
