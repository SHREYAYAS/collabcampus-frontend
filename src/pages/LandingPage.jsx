import React from 'react'
import { Box, Container, Typography, Button } from '@mui/material'
import LandingHeader from '../components/LandingHeader'
import { useNavigate } from 'react-router-dom'

export default function LandingPage() {
  const navigate = useNavigate()
  return (
    <Box sx={{ minHeight: '100vh', background: 'radial-gradient(circle, #f0f9ff 0%, #ffffff 70%)' }}>
      <LandingHeader />

      <Container maxWidth="md">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            minHeight: '80vh',
            py: 8,
            gap: 2,
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontWeight: 'bold',
              letterSpacing: '-0.02em',
              color: '#0F172A',
              fontSize: { xs: '2.5rem', sm: '3.25rem', md: '4rem' },
            }}
          >
            CollabCampus
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ maxWidth: 720 }}
          >
            The All-In-One Hub for Student Projects
          </Typography>

          <Button
            size="large"
            variant="contained"
            sx={{
              mt: 2,
              px: 4,
              py: 1.25,
              background: 'linear-gradient(to right, #3b82f6, #6366f1)',
              color: '#fff',
            }}
            onClick={() => navigate('/register')}
          >
            Get Started
          </Button>
        </Box>
      </Container>
    </Box>
  )
}
