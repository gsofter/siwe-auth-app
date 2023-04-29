// ** React Imports
import { ReactNode, useState } from 'react'

// ** Next Imports
import Link from 'next/link'
import absoluteUrl from 'next-absolute-url'
import { useAccount } from 'wagmi'
import type { AxiosError } from 'axios'

// ** MUI Components
import MuiLink from '@mui/material/Link'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Typography from '@mui/material/Typography'
import { Card, CardContent, CircularProgress } from '@mui/material'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { fetchSigner } from '@wagmi/core'

// ** Layout Import
import BlankLayout from '@/layouts/BlankLayout'
import { WalletConnectButton } from '@/components/ConnectKitButton'

import { createSiweMessage } from '@/lib/siwe'
import { axiosClient } from '@/lib/axiosClient'

const schema = yup.object().shape({
  username: yup.string().required()
})

const defaultValues = {
  username: ''
}

interface FormData {
  username: string
}

const RegisterPage = ({ host }: { host: string }) => {
  // ** Hooks
  const { address, isConnected } = useAccount()
  const [loading, setLoading] = useState(false)

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit = async (data: FormData) => {
    const { username } = data

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

      const signupResponse = await axiosClient.post(`/user/signup`, {
        message,
        signature,
        username,
        eoaAddress: address,
        nonce
      })

      console.log('signupResponse => ', signupResponse)

      setLoading(false)
    } catch (e: any) {
      console.log(e.response.message)
      setError('username', {
        type: 'manual',
        message: ''
      })

      setLoading(false)
    }
  }

  return (
    <Box className='content-center'>
      <Card sx={{ zIndex: 1 }}>
        <CardContent sx={{ p: theme => `${theme.spacing(13, 7, 6.5)} !important`, minWidth: '400px' }}>
          <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant='h6' sx={{ ml: 2, lineHeight: 1, fontWeight: 700, fontSize: '1.5rem !important' }}>
              SIWE - SIGNUP
            </Typography>
          </Box>
          <Box sx={{ mb: 6 }}>
            {!isConnected ? (
              <Typography variant='body2'>{'Please connected your wallet to register'}</Typography>
            ) : (
              <> </>
            )}
          </Box>

          <WalletConnectButton />
          {isConnected ? (
            <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name='username'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      autoFocus
                      label='Username'
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.username)}
                    />
                  )}
                />
                {errors.username && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.username.message}</FormHelperText>
                )}
              </FormControl>
              <Button fullWidth size='large' type='submit' variant='contained' sx={{ mb: 7 }} disabled={loading}>
                {loading ? <CircularProgress /> : 'Submit'}
              </Button>
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Typography sx={{ mr: 2, color: 'text.secondary' }}>Already have a account?</Typography>
                <Typography>
                  <Link passHref href='/login'>
                    <Typography component={MuiLink} sx={{ color: 'primary.main' }}>
                      Sign In with Account
                    </Typography>
                  </Link>
                </Typography>
              </Box>
            </form>
          ) : (
            <></>
          )}
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

RegisterPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

RegisterPage.guestGuard = true

export default RegisterPage
