import axios, { AxiosRequestConfig } from 'axios'
import { getCookie } from './cookies'

export const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 15000
})

const requestIntercepter = async (config: AxiosRequestConfig) => {
  const authToken = getCookie('access_token')

  if (authToken && config.headers) {
    config.headers.Authorization = `Bearer ${authToken}`
  }

  return config
}

axiosClient.interceptors.request.use(requestIntercepter)
