// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

const Home = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Welcome to the SIWE Auth App 🚀'></CardHeader>
          <CardContent>
            <Typography sx={{ mb: 2 }}>This App is for PoC of SIWE Authentication Protocal.</Typography>
            <Typography></Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default Home
