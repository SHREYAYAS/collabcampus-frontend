import React from 'react'
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export default function LandingHeader() {
  const navigate = useNavigate()
  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar>
        {/* Left: Brand */}
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          CollabCampus
        </Typography>

        {/* Center: Nav links */}
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
          <Button color="inherit">How It Works</Button>
          <Button color="inherit">Blog</Button>
        </Box>

        {/* Right: CTA */}
        <Button
          variant="contained"
          sx={{
            background: 'linear-gradient(to right, #3b82f6, #6366f1)',
            color: '#fff',
          }}
          onClick={() => navigate('/register')}
        >
          Get Started
        </Button>
      </Toolbar>
    </AppBar>
  )
}
