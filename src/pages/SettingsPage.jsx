import React from 'react'
import { Container, Typography } from '@mui/material'

export default function SettingsPage() {
  return (
    <Container maxWidth="lg" sx={{ mt: 3 }}>
      <Typography variant="h4" gutterBottom>Settings</Typography>
      <Typography color="text.secondary">This is a placeholder for the Settings page.</Typography>
    </Container>
  )
}
