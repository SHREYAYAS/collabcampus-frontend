import React from 'react'
import { Box, Stack, Typography, Chip, Tooltip, Button } from '@mui/material'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import { useNavigate } from 'react-router-dom'
import { alpha } from '@mui/material/styles'
import FolderOpenIcon from '@mui/icons-material/FolderOpen'

const projects = [
  { title: 'Develop API Endpoints', due: 'Nov 25, 2024', color: '#0EA5E9', status: 'In Progress' },
  { title: 'Onboarding Flow', due: 'Nov 28, 2024', color: '#10B981', status: 'Review' },
  { title: 'Build Dashboard', due: 'Nov 30, 2024', color: '#F59E0B', status: 'Pending' },
  { title: 'Optimize Page Load', due: 'Dec 5, 2024', color: '#8B5CF6', status: 'In Progress' },
  { title: 'Cross-Browser Testing', due: 'Dec 6, 2024', color: '#EF4444', status: 'Completed' },
]

const shortDue = (str) => (typeof str === 'string' ? str.replace(/,\s*\d{4}$/, '') : str)

const statusToColor = (status) => {
  switch (status) {
    case 'Completed':
      return 'success'
    case 'In Progress':
      return 'info'
    case 'Review':
      return 'secondary'
    case 'Pending':
      return 'warning'
    default:
      return 'default'
  }
}

export default function ProjectListMini() {
  const navigate = useNavigate()
  return (
    <Stack spacing={1.5}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
          <Typography variant="h6">Projects</Typography>
          <Typography variant="caption" color="text.secondary">{projects.length}</Typography>
        </Box>
        <Button
          size="small"
          color="primary"
          endIcon={<ArrowForwardIosIcon sx={{ fontSize: 14 }} />}
          onClick={() => navigate('/projects')}
          sx={{
            textTransform: 'none',
            borderRadius: 999,
            px: 1,
            '& .MuiButton-endIcon': { transition: 'transform 120ms ease' },
            '&:hover': { bgcolor: 'action.hover' },
            '&:hover .MuiButton-endIcon': { transform: 'translateX(2px)' },
            '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main' },
          }}
        >
          View all
        </Button>
      </Box>
      <Stack spacing={0.25}>
        {projects.length === 0 && (
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            py: 4,
            px: 2,
            color: 'text.secondary',
            bgcolor: (theme) => alpha(theme.palette.text.primary, 0.02),
            borderRadius: 2,
          }}>
            <FolderOpenIcon sx={{ fontSize: 28, mb: 1, color: 'text.disabled' }} />
            <Typography variant="body2" sx={{ mb: 1 }}>No projects yet</Typography>
            <Button size="small" variant="outlined" onClick={() => navigate('/projects')} sx={{ borderRadius: 999 }}>
              Create one
            </Button>
          </Box>
        )}
        {projects.map((p, idx) => (
          <Box
            key={p.title}
            sx={(theme) => ({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 0.75,
              borderRadius: 2,
              transition: 'background-color 0.15s ease',
              bgcolor: idx % 2 === 1 ? alpha(theme.palette.text.primary, 0.03) : 'transparent',
              cursor: 'pointer',
              '&:hover': { bgcolor: theme.palette.action.hover },
              '&:hover .row-hover-icon': { opacity: 1, transform: 'translateX(0)' },
              '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main' },
            })}
            role="button"
            tabIndex={0}
            onClick={() => navigate('/projects')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                navigate('/projects')
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: p.color, display: 'inline-block', flex: '0 0 auto' }} />
              <Tooltip title={p.title} arrow>
                <Typography variant="body2" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {p.title}
                </Typography>
              </Tooltip>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', flexShrink: 0 }}>
              <Chip
                size="small"
                variant="outlined"
                color={statusToColor(p.status)}
                label={p.status}
                sx={{
                  height: 20,
                  '& .MuiChip-label': { px: 0.75, py: 0, fontSize: 10.5, fontWeight: 500 },
                }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CalendarMonthIcon sx={{ fontSize: 15 }} />
                <Tooltip title={p.due} arrow>
                  <Typography variant="caption">{shortDue(p.due)}</Typography>
                </Tooltip>
              </Box>
              <ChevronRightRoundedIcon
                className="row-hover-icon"
                sx={{ fontSize: 16, ml: 0.25, opacity: 0, transform: 'translateX(-2px)', transition: 'opacity 120ms ease, transform 120ms ease' }}
              />
            </Box>
          </Box>
        ))}
      </Stack>
    </Stack>
  )
}
