import React from 'react'
import { Container, Typography } from '@mui/material'

export default function CalendarPage() {
  return (
    <Container maxWidth="lg" sx={{ mt: 3 }}>
      <Typography variant="h4" gutterBottom>Calendar</Typography>
      <Typography color="text.secondary">This is a placeholder for the Calendar page.</Typography>
    </Container>
  )
}
