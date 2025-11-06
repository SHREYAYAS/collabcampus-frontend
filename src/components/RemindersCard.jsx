import React from 'react'
import { Box, Typography, Button, Stack, Chip } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront'

export default function RemindersCard() {
  return (
    <Stack spacing={1.5}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6">Reminders</Typography>
        <Button size="small" variant="outlined" startIcon={<AddIcon />} sx={{ borderRadius: 999 }}>New</Button>
      </Box>
      <Chip label="Meeting" size="small" color="success" variant="outlined" sx={{ alignSelf: 'flex-start', borderRadius: 1.5 }} />
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Meeting with Arc Company</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
          <AccessTimeIcon fontSize="small" sx={{ color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">02:00 – 04:00 pm</Typography>
        </Box>
      </Box>
      <Box>
        <Button variant="contained" color="primary" startIcon={<VideoCameraFrontIcon />} sx={{ borderRadius: 999, px: 2 }}>Start Meeting</Button>
      </Box>
    </Stack>
  )
}
