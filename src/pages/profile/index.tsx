// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { useAuth } from '@/hooks/useAuth'

const Profile = () => {
  const { user } = useAuth()

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Profile'></CardHeader>
          <CardContent>
            <Typography sx={{ mb: 2 }}>Username: {user?.username}</Typography>
            <Typography>Wallet address: {user?.eoaAddress}</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default Profile
