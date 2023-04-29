import { SiweMessage } from 'siwe'
import { axiosClient } from './axiosClient'

type CreateSiweMessageParams = {
  address: string
  statement: string
  domain: string
  chainId?: number
}

export async function createSiweMessage(params: CreateSiweMessageParams) {
  const res = await axiosClient.get('/user/nonce')

  const message = new SiweMessage({
    domain: params.domain,
    address: params.address,
    statement: params.statement,
    uri: origin,
    version: '1',
    chainId: params.chainId || 1,
    nonce: res.data.nonce
  })

  return { message: message.prepareMessage(), nonce: res.data.nonce }
}
