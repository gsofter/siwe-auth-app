// ** React Imports
import { ReactNode, useState } from 'react'

// ** Next Imports
import Link from 'next/link'
import absoluteUrl from 'next-absolute-url'

import { fetchSigner } from '@wagmi/core'

// ** MUI Components
import MuiLink from '@mui/material/Link'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Card, CardContent } from '@mui/material'

// ** Layout Import
import BlankLayout from '@/layouts/BlankLayout'
import { WalletConnectButton } from '@/components/ConnectKitButton'
import { useAccount } from 'wagmi'
import { axiosClient } from '@/lib/axiosClient'
import { createSiweMessage } from '@/lib/siwe'
import { setCookie } from '@/lib/cookies'
import { useAuth } from '@/hooks/useAuth'

const LoginPage = ({ host }: { host: string }) => {
  // ** Hooks
  const { address, isConnected } = useAccount()
  const [loading, setLoading] = useState(false)
  const { fetchUserProfile } = useAuth()

  const onClickSignIn = async () => {
    if (!isConnected || !address) return
    setLoading(true)
    try {
      const signer = await fetchSigner()
      if (!signer) {
        setLoading(false)

        return
      }

      const { message, nonce } = await createSiweMessage({
        address: address as string,
        domain: host,
        statement: 'Sign to SIWE App'
      })

      const signature = await signer.signMessage(message)

      const signInResponse = await axiosClient.post(`/user/signin`, {
        message,
        signature,
        eoaAddress: address,
        nonce
      })

      setCookie('access_token', signInResponse.data.access_token)

      fetchUserProfile()

      setLoading(false)
    } catch (e: any) {
      console.log(e.message)

      setLoading(false)
    }
  }

  return (
    <Box className='content-center'>
      <Card sx={{ zIndex: 1 }}>
        <CardContent sx={{ p: theme => `${theme.spacing(13, 7, 6.5)} !important`, minWidth: '400px' }}>
          <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant='h6' sx={{ ml: 2, lineHeight: 1, fontWeight: 700, fontSize: '1.5rem !important' }}>
              SIWE - SIGNIN
            </Typography>
          </Box>
          <Box sx={{ mb: 6 }}>
            {!isConnected ? (
              <Typography variant='body2'>{'Please connected your wallet to Sign In'}</Typography>
            ) : (
              <> </>
            )}
          </Box>

          <WalletConnectButton />

          {isConnected ? (
            <Button
              fullWidth
              size='large'
              type='submit'
              variant='contained'
              sx={{ mb: 7 }}
              disabled={loading}
              onClick={onClickSignIn}
            >
              {loading ? <CircularProgress /> : 'Sign In'}
            </Button>
          ) : (
            <></>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', mt: 5 }}>
            <Typography sx={{ mr: 2, color: 'text.secondary' }}>{"You don't have account?"}</Typography>
            <Typography>
              <Link passHref href='/register'>
                <Typography component={MuiLink} sx={{ color: 'primary.main' }}>
                  Create new account
                </Typography>
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export async function getServerSideProps(context: any) {
  const { req } = context
  const { host } = absoluteUrl(req)

  return {
    props: {
      host
    }
  }
}

LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

LoginPage.guestGuard = true

export default LoginPage
