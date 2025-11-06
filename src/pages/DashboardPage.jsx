import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import client from '../api/client'
import { Typography, Container, Grid, Paper, Button, Box, Chip, ToggleButtonGroup, ToggleButton } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import GridViewIcon from '@mui/icons-material/GridView'
import TaskIcon from '@mui/icons-material/AssignmentTurnedIn'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import GroupIcon from '@mui/icons-material/Group'
import AnalyticsChart from '../components/AnalyticsChart'
import ProjectProgressDonut from '../components/ProjectProgressDonut'
import RemindersCard from '../components/RemindersCard'
import TeamCollaboration from '../components/TeamCollaboration'
import ProjectListMini from '../components/ProjectListMini'
import TimeTrackerCard from '../components/TimeTrackerCard'
import StatCard from '../components/StatCard'

export default function DashboardPage() {
  const [projects, setProjects] = useState([])
  const [chartRange, setChartRange] = useState('7d')
  const navigate = useNavigate()

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const { data } = await client.get('/projects')
        const list = Array.isArray(data) ? data : (data?.projects || [])
        setProjects(list)
      } catch {
        setProjects([])
      }
    }
    loadProjects()
  }, [])

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Title + Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5, gap: 2, flexWrap: 'wrap' }}>
          <Typography variant="h4" fontWeight="bold">
            Dashboard
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              sx={{
                borderRadius: 999,
                px: 2.25,
                py: 1,
                boxShadow: '0 6px 16px rgba(16,185,129,0.25)',
                '&:hover': { boxShadow: '0 8px 24px rgba(16,185,129,0.32)' },
              }}
              onClick={() => navigate && navigate('/projects')}
            >
              Add Project
            </Button>
            <Button
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              sx={{
                borderRadius: 999,
                px: 2.25,
                py: 1,
                borderColor: 'divider',
                boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                '&:hover': { boxShadow: '0 6px 12px rgba(0,0,0,0.1)', bgcolor: 'background.default' },
              }}
            >
              Import Data
            </Button>
          </Box>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Plan, prioritize, and accomplish your tasks with ease.
        </Typography>

        {/* Top Stats Cards */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Projects"
              value={projects?.length ?? 0}
              icon={<GridViewIcon fontSize="small" sx={{ color: '#fff' }} />}
              subtitle="Increased from last month"
              trend="up"
              titleColor="#ffffff"
              valueColor="#ffffff"
              subtitleAsBadge
              badgeBg="rgba(255,255,255,0.25)"
              badgeColor="#ffffff"
              trendColor="#ffffff"
              sx={{ background: 'linear-gradient(135deg, #0EA5E9 0%, #10B981 100%)', color: 'white', borderRadius: 0, boxShadow: '0 8px 28px rgba(0,0,0,0.06)', border: '1px solid', borderColor: 'rgba(255,255,255,0.35)' }}
              showCornerArrow
              onCornerClick={() => navigate('/projects')}
              cornerTooltip="Open projects"
              cornerSx={{
                bgcolor: 'rgba(255,255,255,0.9)',
                borderColor: 'rgba(255,255,255,0.95)',
                '&:hover': { bgcolor: 'rgba(255,255,255,1)' },
                color: 'text.primary',
              }}
              iconBoxSx={{
                bgcolor: 'rgba(255,255,255,0.18)',
                border: '1px solid rgba(255,255,255,0.28)',
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Ended Projects"
              value={10}
              icon={<TaskIcon fontSize="small" color="action" />}
              subtitle="Increased from last month"
              trend="up"
              subtitleAsBadge
              sx={{ borderRadius: 0, boxShadow: '0 8px 28px rgba(0,0,0,0.06)', border: '1px solid', borderColor: 'divider', bgcolor: '#fff' }}
              showCornerArrow
              onCornerClick={() => navigate('/projects')}
              cornerTooltip="View ended projects"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Running Projects"
              value={12}
              icon={<DoneAllIcon fontSize="small" color="action" />}
              subtitle="Increased from last month"
              trend="up"
              subtitleAsBadge
              sx={{ borderRadius: 0, boxShadow: '0 8px 28px rgba(0,0,0,0.06)', border: '1px solid', borderColor: 'divider', bgcolor: '#fff' }}
              showCornerArrow
              onCornerClick={() => navigate('/projects')}
              cornerTooltip="View running projects"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Pending Projects"
              value={2}
              icon={<GroupIcon fontSize="small" color="action" />}
              subtitle="On Discuss"
              trend="none"
              subtitleAsBadge
              sx={{ borderRadius: 0, boxShadow: '0 8px 28px rgba(0,0,0,0.06)', border: '1px solid', borderColor: 'divider', bgcolor: '#fff' }}
              showCornerArrow
              onCornerClick={() => navigate('/projects')}
              cornerTooltip="View pending projects"
            />
          </Grid>
        </Grid>

        {/* Charts Row */}
  <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 2, height: 260, borderRadius: 0, border: '1px solid', borderColor: 'divider', boxShadow: '0 8px 28px rgba(0,0,0,0.06)', bgcolor: '#fff' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle1" fontWeight={600}>Project Analytics</Typography>
                <ToggleButtonGroup
                  size="small"
                  value={chartRange}
                  exclusive
                  onChange={(e, val) => { if (val) setChartRange(val) }}
                  sx={{
                    '& .MuiToggleButton-root': {
                      textTransform: 'none',
                      borderRadius: 999,
                      px: 1.25,
                      py: 0.25,
                    },
                  }}
                >
                  <ToggleButton value="7d">7d</ToggleButton>
                  <ToggleButton value="30d">30d</ToggleButton>
                </ToggleButtonGroup>
              </Box>
              <AnalyticsChart range={chartRange} />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} lg={2}>
              <Paper sx={{ p: 2, minHeight: 220, borderRadius: 0, border: '1px solid', borderColor: 'divider', boxShadow: '0 8px 28px rgba(0,0,0,0.06)', bgcolor: '#fff' }}>
              <RemindersCard />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} lg={2}>
              <Paper sx={{ p: 2, borderRadius: 0, border: '1px solid', borderColor: 'divider', boxShadow: '0 8px 28px rgba(0,0,0,0.06)', bgcolor: '#fff' }}>
              <ProjectListMini />
            </Paper>
          </Grid>
        </Grid>

        {/* Collaboration + Progress + Time Tracker in a single row */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {/* Team Collaboration - wider on desktop */}
          <Grid item xs={12} md={6} lg={6}>
              <Paper sx={{ p: 2, height: 300, display: 'flex', flexDirection: 'column', borderRadius: 0, border: '1px solid', borderColor: 'divider', bgcolor: '#fff', boxShadow: '0 8px 28px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
              <TeamCollaboration />
            </Paper>
          </Grid>

          {/* Project Progress (center) */}
          <Grid item xs={12} md={4} lg={4}>
          <Paper sx={{ p: 2, height: 260, display: 'flex', flexDirection: 'column', borderRadius: 0, border: '1px solid', borderColor: 'divider', bgcolor: '#fff', boxShadow: '0 8px 28px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
              <Typography variant="h6" gutterBottom>Project Progress</Typography>
              <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ProjectProgressDonut value={41} scale={0.92} offsetX={0} offsetY={0} cutout={'68%'} />
              </Box>
            </Paper>
          </Grid>

          {/* Time Tracker (right side) */}
          <Grid item xs={12} md={2} lg={2}>
              <Paper sx={{ p: 0, height: 300, borderRadius: 0, border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.12)', overflow: 'hidden' }}>
              <TimeTrackerCard />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}