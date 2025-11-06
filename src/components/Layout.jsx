import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Box, Drawer, AppBar, Toolbar, Typography, List, ListItem, ListItemIcon, ListItemText, ListItemButton, IconButton, Badge, Menu, MenuItem, Button, TextField, InputAdornment, ListSubheader, Divider, Tooltip, Avatar, Chip } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import DashboardIcon from '@mui/icons-material/Dashboard'
import ProjectIcon from '@mui/icons-material/AccountTree'
import NotificationsIcon from '@mui/icons-material/Notifications'
import MailIcon from '@mui/icons-material/Mail'
import ListAltIcon from '@mui/icons-material/ListAlt'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import AnalyticsIcon from '@mui/icons-material/QueryStats'
import GroupIcon from '@mui/icons-material/Group'
import SettingsIcon from '@mui/icons-material/Settings'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import LogoutIcon from '@mui/icons-material/Logout'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { setToken, fetchCurrentUser } from '../api/client'
import client from '../api/client'

const drawerWidth = 256

export default function Layout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [invites, setInvites] = useState([])
  const [anchorEl, setAnchorEl] = useState(null)
  const [profileEl, setProfileEl] = useState(null)
  const [collapsed, setCollapsed] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sidebar_collapsed') || 'false') } catch { return false }
  })
  const [projectsCount, setProjectsCount] = useState(0)
  const [tasksCount, setTasksCount] = useState(0)
  const [user, setUser] = useState(null)

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget)
  const handleMenuClose = () => setAnchorEl(null)

  const handleAccept = async (inviteId) => {
    if (!inviteId) return
    try {
      try {
        await client.post(`/api/invites/${encodeURIComponent(inviteId)}/accept`)
      } catch {
        // fallback without /api prefix if backend expects it
        await client.post(`/invites/${encodeURIComponent(inviteId)}/accept`)
      }
      setInvites((prev) => prev.filter((inv) => (inv._id || inv.id) !== inviteId))
      handleMenuClose()
    } catch (e) {
      if (import.meta?.env?.DEV) console.debug('Failed to accept invite', e)
    }
  }

  const handleDecline = async (inviteId) => {
    if (!inviteId) return
    try {
      try {
        await client.post(`/api/invites/${encodeURIComponent(inviteId)}/decline`)
      } catch {
        await client.post(`/invites/${encodeURIComponent(inviteId)}/decline`)
      }
      setInvites((prev) => prev.filter((inv) => (inv._id || inv.id) !== inviteId))
      handleMenuClose()
    } catch (e) {
      if (import.meta?.env?.DEV) console.debug('Failed to decline invite', e)
    }
  }

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const { data } = await client.get('/invites/me')
        const list = Array.isArray(data) ? data : (data?.invites || [])
        if (mounted) setInvites(list)
      } catch (e) {
        if (import.meta?.env?.DEV) console.debug('Failed to fetch invites', e)
      }
    })()
    return () => { mounted = false }
  }, [])

  const handleNav = (path) => () => navigate(path)
  const handleLogout = () => {
    setToken(null)
    navigate('/login')
  }
  const toggleCollapsed = () => {
    setCollapsed((c) => {
      const next = !c
      try { localStorage.setItem('sidebar_collapsed', JSON.stringify(next)) } catch (e) { void e }
      return next
    })
  }

  const handleProfileOpen = (e) => setProfileEl(e.currentTarget)
  const handleProfileClose = () => setProfileEl(null)

  // Fetch current user and counts
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const u = await fetchCurrentUser()
        if (mounted) setUser(u)
      } catch (e) {
        if (import.meta?.env?.DEV) console.debug('Failed to fetch current user', e)
      }
      try {
        const { data: projectsData } = await client.get('/projects')
        const list = Array.isArray(projectsData) ? projectsData : (projectsData?.projects || [])
        if (mounted) setProjectsCount(list.length)
        // Try to infer tasks from projects if /tasks is not available
        const inferredTasks = list.reduce((acc, p) => acc + (Array.isArray(p.tasks) ? p.tasks.length : 0), 0)
        if (inferredTasks > 0 && mounted) setTasksCount(inferredTasks)
      } catch (e) {
        if (import.meta?.env?.DEV) console.debug('Failed to fetch projects', e)
      }
      try {
        // Prefer a dedicated tasks endpoint if available
        const { data: tasksData } = await client.get('/tasks')
        const tasksList = Array.isArray(tasksData) ? tasksData : (tasksData?.tasks || [])
        if (mounted) setTasksCount(tasksList.length)
      } catch (e) {
        if (import.meta?.env?.DEV) console.debug('Failed to fetch tasks', e)
      }
    })()
    return () => { mounted = false }
  }, [])

  const navButtonSx = {
    mx: 1,
    my: 0.5,
    borderRadius: 2,
    '&:hover': {
      bgcolor: 'action.hover',
    },
    '&.Mui-selected': {
      bgcolor: 'rgba(16,185,129,0.12)',
      color: 'primary.main',
    },
    '&.Mui-selected .MuiListItemIcon-root': {
      color: 'primary.main',
    },
  }

  const computedWidth = collapsed ? 80 : drawerWidth

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" color="default" elevation={0} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: 'background.paper', color: 'text.primary', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Toolbar sx={{ gap: 2 }}>
          <IconButton size="small" onClick={toggleCollapsed} sx={{ mr: 1 }}>
            {collapsed ? <MenuIcon /> : <ChevronLeftIcon />}
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            CollabCampus
          </Typography>
          <Box sx={{ flex: 1 }} />
          {/* Search */}
          <Box component="form" onSubmit={(e)=> e.preventDefault()} sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            <TextField
              placeholder="Search task"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{
                minWidth: 320,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 999,
                  backgroundColor: 'background.default',
                  px: 1,
                },
                '& input::placeholder': { color: 'text.secondary' },
              }}
            />
          </Box>

          {/* Notifications */}
          <IconButton color="inherit" onClick={handleMenuOpen} aria-label="show invites">
            <Badge badgeContent={invites.length} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* Profile */}
          <Tooltip title={user?.name || user?.username || user?.email || 'Account'}>
            <Chip
              onClick={handleProfileOpen}
              avatar={<Avatar sx={{ width: 28, height: 28 }}>{(user?.name || user?.username || user?.email || 'U').charAt(0).toUpperCase()}</Avatar>}
              label={user?.name || user?.username || 'User'}
              variant="outlined"
              sx={{ ml: 1, display: { xs: 'none', sm: 'flex' } }}
            />
          </Tooltip>
          <IconButton sx={{ display: { xs: 'inline-flex', sm: 'none' } }} onClick={handleProfileOpen}>
            <Avatar sx={{ width: 28, height: 28 }}>{(user?.name || user?.username || user?.email || 'U').charAt(0).toUpperCase()}</Avatar>
          </IconButton>
        </Toolbar>

        {/* Invites Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          {(!invites || invites.length === 0) && (
            <MenuItem disabled>No pending invites.</MenuItem>
          )}
          {(invites || []).map((inv) => {
            const key = inv._id || inv.id
            const projectTitle = inv.project?.title || inv.project?.name || inv.projectTitle || 'Project'
            const fromUser = inv.fromUser?.username || inv.fromUser?.name || inv.fromUser?.email || 'Someone'
            return (
              <MenuItem key={key} onClick={(e) => e.stopPropagation()}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, width: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ListItemIcon>
                      <MailIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="body2">
                      Invite to {projectTitle} from {fromUser}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Button size="small" variant="contained" onClick={(e) => { e.stopPropagation(); handleAccept(inv._id || inv.id) }}>Accept</Button>
                    <Button size="small" variant="outlined" onClick={(e) => { e.stopPropagation(); handleDecline(inv._id || inv.id) }}>Decline</Button>
                  </Box>
                </Box>
              </MenuItem>
            )
          })}
        </Menu>

        {/* Profile Menu */}
        <Menu
          anchorEl={profileEl}
          open={Boolean(profileEl)}
          onClose={handleProfileClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem disabled>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ width: 24, height: 24 }}>
                {(user?.name || user?.username || user?.email || 'U').charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="body2" sx={{ lineHeight: 1 }}>
                  {user?.name || user?.username || 'User'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.email || ''}
                </Typography>
              </Box>
            </Box>
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => { handleProfileClose(); navigate('/settings') }}>Settings</MenuItem>
          <MenuItem onClick={() => { handleProfileClose(); handleLogout() }}>Logout</MenuItem>
        </Menu>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: computedWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: computedWidth,
            boxSizing: 'border-box',
            bgcolor: 'background.paper',
            color: 'text.primary',
            borderRight: '1px solid',
            borderColor: 'divider',
            pt: 1,
            transition: 'width 0.2s ease',
            overflowX: 'hidden',
            ...(collapsed && {
              '& .MuiListItemIcon-root': { minWidth: 0, justifyContent: 'center' },
              '& .MuiListItemText-root': { display: 'none' },
            }),
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List
            dense
            subheader={
              <ListSubheader component="div" sx={{ bgcolor: 'transparent', color: 'text.secondary', fontWeight: 700, letterSpacing: 0.5 }}>
                Menu
              </ListSubheader>
            }
          >
            <ListItem disablePadding>
              <Tooltip placement="right" title={collapsed ? 'Dashboard' : ''} disableHoverListener={!collapsed}>
                <ListItemButton
                  selected={location.pathname === '/dashboard'}
                  onClick={handleNav('/dashboard')}
                  sx={navButtonSx}
                >
                  <ListItemIcon>
                    <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItemButton>
              </Tooltip>
            </ListItem>
            <ListItem disablePadding>
              <Tooltip placement="right" title={collapsed ? 'Projects' : ''} disableHoverListener={!collapsed}>
                <ListItemButton
                  selected={location.pathname.startsWith('/projects')}
                  onClick={handleNav('/projects')}
                  sx={navButtonSx}
                >
                  <ListItemIcon>
                    {collapsed ? (
                      <Badge color="primary" badgeContent={projectsCount} max={99}>
                        <ProjectIcon />
                      </Badge>
                    ) : (
                      <ProjectIcon />
                    )}
                  </ListItemIcon>
                  <ListItemText primary="Projects" />
                  {!collapsed && projectsCount > 0 && (
                    <Chip size="small" label={projectsCount} sx={{ ml: 'auto' }} />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
            <ListItem disablePadding>
              <Tooltip placement="right" title={collapsed ? 'Tasks' : ''} disableHoverListener={!collapsed}>
                <ListItemButton
                  selected={location.pathname.startsWith('/tasks')}
                  onClick={handleNav('/tasks')}
                  sx={navButtonSx}
                >
                  <ListItemIcon>
                    {collapsed ? (
                      <Badge color="primary" badgeContent={tasksCount} max={99}>
                        <ListAltIcon />
                      </Badge>
                    ) : (
                      <ListAltIcon />
                    )}
                  </ListItemIcon>
                  <ListItemText primary="Tasks" />
                  {!collapsed && tasksCount > 0 && (
                    <Chip size="small" label={tasksCount} sx={{ ml: 'auto' }} />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
            <ListItem disablePadding>
              <Tooltip placement="right" title={collapsed ? 'Calendar' : ''} disableHoverListener={!collapsed}>
                <ListItemButton
                  selected={location.pathname.startsWith('/calendar')}
                  onClick={handleNav('/calendar')}
                  sx={navButtonSx}
                >
                  <ListItemIcon><CalendarMonthIcon /></ListItemIcon>
                  <ListItemText primary="Calendar" />
                </ListItemButton>
              </Tooltip>
            </ListItem>
            <ListItem disablePadding>
              <Tooltip placement="right" title={collapsed ? 'Analytics' : ''} disableHoverListener={!collapsed}>
                <ListItemButton
                  selected={location.pathname.startsWith('/analytics')}
                  onClick={handleNav('/analytics')}
                  sx={navButtonSx}
                >
                  <ListItemIcon><AnalyticsIcon /></ListItemIcon>
                  <ListItemText primary="Analytics" />
                </ListItemButton>
              </Tooltip>
            </ListItem>
            <ListItem disablePadding>
              <Tooltip placement="right" title={collapsed ? 'Team' : ''} disableHoverListener={!collapsed}>
                <ListItemButton
                  selected={location.pathname.startsWith('/team')}
                  onClick={handleNav('/team')}
                  sx={navButtonSx}
                >
                  <ListItemIcon><GroupIcon /></ListItemIcon>
                  <ListItemText primary="Team" />
                </ListItemButton>
              </Tooltip>
            </ListItem>
          </List>
          <Divider sx={{ my: 1 }} />
          <List
            dense
            subheader={
              <ListSubheader component="div" sx={{ bgcolor: 'transparent', color: 'text.secondary', fontWeight: 700, letterSpacing: 0.5 }}>
                General
              </ListSubheader>
            }
          >
            <ListItem disablePadding>
              <Tooltip placement="right" title={collapsed ? 'Settings' : ''} disableHoverListener={!collapsed}>
                <ListItemButton
                  selected={location.pathname.startsWith('/settings')}
                  onClick={handleNav('/settings')}
                  sx={navButtonSx}
                >
                  <ListItemIcon><SettingsIcon /></ListItemIcon>
                  <ListItemText primary="Settings" />
                </ListItemButton>
              </Tooltip>
            </ListItem>
            <ListItem disablePadding>
              <Tooltip placement="right" title={collapsed ? 'Help' : ''} disableHoverListener={!collapsed}>
                <ListItemButton
                  selected={location.pathname.startsWith('/help')}
                  onClick={handleNav('/help')}
                  sx={navButtonSx}
                >
                  <ListItemIcon><HelpOutlineIcon /></ListItemIcon>
                  <ListItemText primary="Help" />
                </ListItemButton>
              </Tooltip>
            </ListItem>
            <ListItem disablePadding>
              <Tooltip placement="right" title={collapsed ? 'Logout' : ''} disableHoverListener={!collapsed}>
                <ListItemButton onClick={handleLogout} sx={navButtonSx}>
                  <ListItemIcon><LogoutIcon /></ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </Tooltip>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {/* spacer for fixed AppBar */}
        <Toolbar />
        {children}
      </Box>
    </Box>
  )
}
