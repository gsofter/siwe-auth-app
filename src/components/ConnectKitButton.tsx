import { ConnectKitButton } from 'connectkit'
import { Button } from '@mui/material'

export const WalletConnectButton = () => {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, isConnecting, show, hide, address, ensName, chain, truncatedAddress }) => {
        return (
          <Button
            variant={isConnected ? 'text' : 'contained'}
            color='primary'
            onClick={show}
            size='large'
            sx={{ textTransform: 'none', width: '100%' }}
          >
            {isConnected ? ensName ?? truncatedAddress : 'Connect Wallet'}{' '}
          </Button>
        )
      }}
    </ConnectKitButton.Custom>
  )
}
