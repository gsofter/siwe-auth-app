// ** React Imports
import { useEffect } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** Spinner Import
import Spinner from '@/components/Spinner'

// ** Hook Imports
import { useAuth } from '@/hooks/useAuth'

/**
 *  Set Home URL based on User Roles
 */
export const getHomeRoute = () => {
  return '/home'
}

const Home = () => {
  // ** Hooks
  const auth = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    if (auth.user) {
      const homeRoute = getHomeRoute()

      // Redirect user to Home URL
      router.replace(homeRoute)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <Spinner />
}

export default Home
