import * as React from 'react'
import NextLink from 'next/link'
import { ConnectKitButton } from 'connectkit'

// ** MUI Imports
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import UserDropdown from './UserDropwdown'

function Header() {
  const LOGO_TEXT = 'SIWE-AUTH'

  return (
    <AppBar position='static'>
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          <VerifiedUserIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant='h6'
            noWrap
            component='a'
            href='/'
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none'
            }}
          >
            {LOGO_TEXT}
          </Typography>

          <VerifiedUserIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant='h5'
            noWrap
            component='a'
            href=''
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none'
            }}
          >
            {LOGO_TEXT}
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ flexGrow: 0, display: 'flex', flexDirection: 'row', gap: '12px', alignItems: 'center' }}>
            <NextLink href={'/home'}>Home</NextLink>
            <NextLink href={'/profile'}>Profile</NextLink>
            <UserDropdown />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
export default Header
