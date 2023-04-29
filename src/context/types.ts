export type ErrCallbackType = (err: { [key: string]: string }) => void

export type UserDataType = {
  id: number
  username: string
  eoaAddress: string
}

export type AuthValuesType = {
  loading: boolean
  setLoading: (value: boolean) => void
  logout: () => void
  isInitialized: boolean
  user: UserDataType | null
  setUser: (value: UserDataType | null) => void
  setIsInitialized: (value: boolean) => void
  fetchUserProfile: () => void
}
