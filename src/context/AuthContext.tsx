// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Types
import { AuthValuesType, UserDataType } from './types'
import { axiosClient } from '@/lib/axiosClient'
import { removeCookie, setCookie } from '@/lib/cookies'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  isInitialized: false,
  logout: () => Promise.resolve(),
  setIsInitialized: () => Boolean,
  fetchUserProfile: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)
  const [isInitialized, setIsInitialized] = useState<boolean>(defaultProvider.isInitialized)

  // ** Hooks
  const router = useRouter()

  const fetchUserProfile = async () => {
    setLoading(true)
    axiosClient
      .get('/user/profile')
      .then(res => {
        setUser(res.data)
        setLoading(false)
      })
      .catch(e => {
        setUser(null)
        removeCookie('access_token')
        setLoading(false)
      })
  }

  useEffect(() => {
    setIsInitialized(true)
    fetchUserProfile()
  }, [])

  const handleLogout = () => {
    setUser(null)
    setIsInitialized(false)
    setCookie('access_token', null)

    router.push('/login')
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    isInitialized,
    setIsInitialized,
    logout: handleLogout,
    fetchUserProfile
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
