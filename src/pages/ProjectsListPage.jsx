import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import client from '../api/client'
import { Typography, Button, Container, Grid, Paper, Card, CardContent, CardActions, TextField, Stack } from '@mui/material'

export default function ProjectsListPage() {
  // Projects state
  const [projects, setProjects] = useState([])
  const [projectsLoading, setProjectsLoading] = useState(true)
  const [projectsError, setProjectsError] = useState('')

  // Create project form state
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')

  const loadProjects = async () => {
    setProjectsLoading(true)
    setProjectsError('')
    try {
      const { data } = await client.get('/projects')
      const list = Array.isArray(data) ? data : (data?.projects || [])
      setProjects(list)
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.msg || err.message
      setProjectsError(msg || 'Failed to load projects')
    } finally {
      setProjectsLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Create Project */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>Create Project</Typography>
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                setCreateError('')
                if (!name.trim()) {
                  setCreateError('Project name is required')
                  return
                }
                setCreating(true)
                const payload = {
                  name: name.trim(),
                  title: name.trim(),
                  description: description.trim(),
                }
                try {
                  const { data } = await client.post('/projects', payload)
                  const created = data?.project || data
                  setProjects((prev) => [created, ...prev])
                  setName('')
                  setDescription('')
                } catch (err) {
                  const status = err?.response?.status
                  const server = err?.response?.data
                  const serverMsg = (server && (server.message || server.msg || JSON.stringify(server)))
                  const msg = serverMsg || err.message
                  console.error('Create project failed', { status, server, msg, payload })
                  setCreateError(`${msg}${status ? ` (status ${status})` : ''}`)
                } finally {
                  setCreating(false)
                }
              }}
            >
              <Stack spacing={2}>
                <TextField
                  id="pname"
                  label="Project name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                  required
                />
                <TextField
                  id="pdesc"
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  fullWidth
                  multiline
                  minRows={3}
                />
                {createError && <Typography color="error">{createError}</Typography>}
                <Button type="submit" variant="contained" disabled={creating} sx={{ alignSelf: 'flex-start' }}>
                  {creating ? 'Creating...' : 'Create Project'}
                </Button>
              </Stack>
            </form>
          </Paper>
        </Grid>

        {/* Projects list */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>My Projects</Typography>
            {projectsLoading && <Typography>Loading projects...</Typography>}
            {projectsError && <Typography color="error">{projectsError}</Typography>}
            {!projectsLoading && !projectsError && (
              <>
                {projects.length === 0 ? (
                  <Typography>No projects yet.</Typography>
                ) : (
                  <Grid container spacing={2}>
                    {projects.map((p) => {
                      const pid = p.id || p._id || p.slug || p.name || p.title
                      const title = p.name || p.title || 'Untitled'
                      const desc = p.description || ''
                      return (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={pid}>
                          <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <CardContent sx={{ flexGrow: 1 }}>
                              <Typography gutterBottom variant="h6" component="div" noWrap>
                                {title}
                              </Typography>
                              {desc && (
                                <Typography variant="body2" color="text.secondary" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                                  {desc}
                                </Typography>
                              )}
                            </CardContent>
                            <CardActions>
                              <Button size="small" component={Link} to={`/projects/${encodeURIComponent(pid)}`}>Open</Button>
                            </CardActions>
                          </Card>
                        </Grid>
                      )
                    })}
                  </Grid>
                )}
                <Button variant="outlined" size="small" onClick={loadProjects} sx={{ mt: 2 }}>Refresh Projects</Button>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}
