import React from 'react'
import { Box, Stack, Typography, Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1'

export default function ProjectHeader({ project }) {
  const title = project?.title || project?.name || 'Untitled Project'
  const desc = project?.description || ''

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <Box sx={{ mb: 2 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }} justifyContent="space-between">
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>{title}</Typography>
          {desc && (
            <Typography variant="body1" color="text.secondary">{desc}</Typography>
          )}
        </Box>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" startIcon={<PersonAddAlt1Icon />} onClick={() => scrollTo('invite-section')} sx={{ borderRadius: 999 }}>
            Invite
          </Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => scrollTo('add-task-section')} sx={{ borderRadius: 999 }}>
            Add Task
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}
