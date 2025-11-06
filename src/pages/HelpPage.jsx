import React from 'react'
import { Container, Typography } from '@mui/material'

export default function HelpPage() {
  return (
    <Container maxWidth="lg" sx={{ mt: 3 }}>
      <Typography variant="h4" gutterBottom>Help</Typography>
      <Typography color="text.secondary">This is a placeholder for the Help page.</Typography>
    </Container>
  )
}
