import React, { useState } from 'react'
import client, { setToken, fetchCurrentUser } from '../api/client'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
} from '@mui/material'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await client.post('/auth/login', { email, password })
      const token = data?.token || data?.accessToken || data?.jwt || data?.data?.token
      if (!token) throw new Error('No token returned by server')
      setToken(token)
      await fetchCurrentUser(true).catch(() => null)
      navigate('/dashboard')
    } catch (err) {
      // surface server message when possible
      const status = err?.response?.status
      const server = err?.response?.data
      const msg = (server && (server.message || server.msg)) || err.message || 'Login failed. Please try again.'
      setError(`${msg}${status ? ` (status ${status})` : ''}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
          Sign in
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleLogin} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </Button>
          <Typography variant="body2" align="center">
            Don’t have an account?{' '}
            <RouterLink to="/register">Register</RouterLink>
          </Typography>
        </Box>
      </Box>
    </Container>
  )
}