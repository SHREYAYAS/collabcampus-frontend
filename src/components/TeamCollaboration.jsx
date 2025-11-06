import React, { useCallback, useEffect, useState } from 'react'
import { Avatar, Box, Chip, Stack, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Alert, CircularProgress, MenuItem } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import client from '../api/client'

const initialPeople = [
  { name: 'Alexandra Deff', role: 'GitHub Project Repository', status: 'Completed', color: 'success', avatar: 'A' },
  { name: 'Edwin Adenike', role: 'Integrate User Authentication', status: 'In Progress', color: 'warning', avatar: 'E' },
  { name: 'Isaac Oluwatemilorun', role: 'Develop Search and Filter', status: 'Pending', color: 'default', avatar: 'I' },
]

export default function TeamCollaboration() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState({ open: false, severity: 'success', msg: '' })
  const [team, setTeam] = useState(initialPeople)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [projects, setProjects] = useState([])
  const [selectedProjectId, setSelectedProjectId] = useState('')

  const toDisplay = (m, projectCount = 1) => {
    const name = m.username || m.name || m.email || 'Member'
    const avatar = (name?.[0] || '?').toUpperCase()
    const rawStatus = (m.status || m.role || '').toString().toLowerCase()
    const isPending = rawStatus.includes('pending')
    const status = isPending ? 'Pending' : 'Active'
    const color = isPending ? 'default' : 'success'
    const role = projectCount > 1 ? `On ${projectCount} projects` : 'Project member'
    return { name, avatar, status, color, role }
  }

  const fetchTeam = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      // Strategy: fetch projects, aggregate unique members across them
      const { data } = await client.get('/projects')
      const list = Array.isArray(data) ? data : (data?.projects || [])
      setProjects(list)
      if (!selectedProjectId && list.length > 0) {
        const firstId = list[0]._id || list[0].id || list[0].slug || list[0].name || list[0].title
        if (firstId) setSelectedProjectId(firstId)
      }
      const counts = new Map()
      const byKey = new Map()
      for (const p of list) {
        const members = p?.members || p?.users || []
        for (const m of members) {
          const key = m._id || m.id || m.email || m.username || JSON.stringify(m)
          const prevCount = counts.get(key) || 0
          counts.set(key, prevCount + 1)
          if (!byKey.has(key)) byKey.set(key, m)
        }
      }
      const next = Array.from(byKey.entries()).map(([key, m]) => toDisplay(m, counts.get(key) || 1))
      // Fallback: if backend returns empty, keep a friendly empty state
      setTeam(next.length ? next : [])
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.msg || err.message
      setError(msg || 'Failed to load team')
      setTeam([])
    } finally {
      setLoading(false)
    }
  }, [selectedProjectId])

  useEffect(() => {
    fetchTeam()
  }, [fetchTeam])

  const inviteMember = async (email, projectId) => {
    if (!projectId) throw new Error('Project is required')
    const { data } = await client.post(
      `/projects/${encodeURIComponent(projectId)}/invite`,
      { email }
    )
    return data
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return
    setSubmitting(true)
    try {
  await inviteMember(email, selectedProjectId)
      // Try to refresh team from backend first; if it doesn't include pending, add optimistically
      fetchTeam().catch(() => {})
      const exists = (m) => (m.name?.toLowerCase() === email.toLowerCase() || m.email?.toLowerCase?.() === email.toLowerCase())
      const already = team.some(exists)
      if (!already) {
        const initial = (email[0] || '?').toUpperCase()
        setTeam((prev) => [
          ...prev,
          { name: email, role: 'Pending invite', status: 'Pending', color: 'default', avatar: initial },
        ])
      }
      setToast({ open: true, severity: 'success', msg: 'Invite sent' })
      setOpen(false)
      setEmail('')
    } catch (err) {
      const status = err?.response?.status
      const serverMsg = err?.response?.data?.message || err?.response?.data?.msg
      const msg = serverMsg || err?.message || 'Failed to send invite'
      setToast({ open: true, severity: 'error', msg: `${msg}${status ? ` (status ${status})` : ''}` })
    } finally {
      setSubmitting(false)
    }
  }

  return (
  <Stack spacing={1.5}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6">Team Collaboration</Typography>
        <Button size="small" variant="outlined" startIcon={<AddIcon />} sx={{ borderRadius: 999 }} onClick={() => setOpen(true)}>
          Add Member
        </Button>
      </Box>
  <Stack spacing={0.75}>
        {loading && (
          <Typography variant="body2" color="text.secondary">Loading team...</Typography>
        )}
        {!loading && error && (
          <Typography variant="body2" color="error">{error}</Typography>
        )}
        {!loading && !error && team.length === 0 && (
          <Typography variant="body2" color="text.secondary">No team members yet.</Typography>
        )}
        {!loading && !error && team.map((p) => (
          <Box key={p.name} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, px: 1, py: 0.75, borderRadius: 2.5, bgcolor: 'grey.50', border: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar sx={{ width: 34, height: 34 }}>{p.avatar}</Avatar>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{p.name}</Typography>
                <Typography variant="caption" color="text.secondary">Working on {p.role}</Typography>
              </Box>
            </Box>
            <Chip
              label={p.status}
              size="small"
              color={p.color === 'success' ? 'success' : p.color === 'warning' ? 'warning' : 'default'}
              variant={p.color === 'default' ? 'outlined' : 'filled'}
            />
          </Box>
        ))}
      </Stack>

      {/* Add Member Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
  <DialogTitle>Add member</DialogTitle>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogContent sx={{ pt: 1 }}>
            {projects.length > 1 && (
              <TextField
                select
                fullWidth
                label="Project"
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                sx={{ mb: 2 }}
                required
              >
                {projects.map((p) => {
                  const pid = p._id || p.id || p.slug || p.name || p.title
                  const title = p.name || p.title || String(pid)
                  return (
                    <MenuItem key={pid} value={pid}>{title}</MenuItem>
                  )
                })}
              </TextField>
            )}
            <TextField
              autoFocus
              fullWidth
              required
              type="email"
              label="Member email"
              placeholder="member@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {projects.length === 0 && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                You don’t have any projects yet. Create a project first to invite a member.
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} disabled={submitting}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={submitting || projects.length === 0 || !selectedProjectId} startIcon={submitting ? <CircularProgress size={16} /> : null}>
              {submitting ? 'Adding...' : 'Add'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Header actions */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button size="small" variant="text" onClick={fetchTeam}>Refresh</Button>
      </Box>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={toast.severity} onClose={() => setToast((t) => ({ ...t, open: false }))} sx={{ width: '100%' }}>
          {toast.msg}
        </Alert>
      </Snackbar>
    </Stack>
  )
}
