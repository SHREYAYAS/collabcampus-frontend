import React from 'react'
import { Container, Typography } from '@mui/material'

export default function TasksPage() {
  return (
    <Container maxWidth="lg" sx={{ mt: 3 }}>
      <Typography variant="h4" gutterBottom>Tasks</Typography>
      <Typography color="text.secondary">This is a placeholder for the Tasks page.</Typography>
    </Container>
  )
}
