import React, { useEffect, useState } from 'react'
import client from '../api/client'

// A small dropdown-style component to show pending invites and accept/decline them.
// Data expectations (defensive):
//   invite: { _id|id, project: { title }, fromUser: { username }, ... }
// API endpoints (using axios client with base '/api'):
//   - GET  '/invites/me'   (spec mentions '/api/invites/me')
//   - POST '/invites/:id/accept'   (spec mentions '/api/invites/:id/accept')
//   - POST '/invites/:id/decline'  (spec mentions '/api/invites/:id/decline')
// We attempt the non-prefixed path first (works with our client base '/api'),
// then fall back to the prefixed path for compatibility with various backends.
export default function InvitesDropdown() {
  const [invites, setInvites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchInvites = async () => {
    setLoading(true)
    setError('')
    try {
      try {
        const { data } = await client.get('/invites/me')
        setInvites(Array.isArray(data) ? data : data?.invites || [])
      } catch {
        // fallback to explicitly prefixed path
        const { data } = await client.get('/api/invites/me')
        setInvites(Array.isArray(data) ? data : data?.invites || [])
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.msg || err.message
      setError(msg || 'Failed to load invites')
      setInvites([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInvites()
  }, [])

  const handleAccept = async (inviteId) => {
    try {
      try {
        await client.post(`/invites/${encodeURIComponent(inviteId)}/accept`)
      } catch {
        await client.post(`/api/invites/${encodeURIComponent(inviteId)}/accept`)
      }
      await fetchInvites()
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.msg || err.message
      alert(msg || 'Failed to accept invite')
    }
  }

  const handleDecline = async (inviteId) => {
    try {
      try {
        await client.post(`/invites/${encodeURIComponent(inviteId)}/decline`)
      } catch {
        await client.post(`/api/invites/${encodeURIComponent(inviteId)}/decline`)
      }
      await fetchInvites()
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.msg || err.message
      alert(msg || 'Failed to decline invite')
    }
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* Content area (can be placed in a navbar popover/dropdown) */}
      <div
        style={{
          minWidth: 280,
          maxWidth: 360,
          background: '#fff',
          border: '1px solid #e5e5e5',
          borderRadius: 8,
          padding: 10,
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <strong>Invites</strong>
          <button onClick={fetchInvites} style={{ fontSize: 12 }}>Refresh</button>
        </div>

        {loading && <p style={{ margin: '8px 0' }}>Loading invites...</p>}
        {error && <p style={{ margin: '8px 0', color: 'red' }}>{error}</p>}

        {!loading && !error && invites.length === 0 && (
          <p style={{ margin: '8px 0', color: '#666' }}>No pending invites</p>
        )}

        {!loading && !error && invites.length > 0 && (
          <ul style={{ listStyle: 'none', padding: 0, margin: '8px 0' }}>
            {invites.map((inv) => {
              const id = inv._id || inv.id
              const projectTitle = inv.project?.title || inv.project?.name || 'Untitled project'
              const inviter = inv.fromUser?.username || inv.fromUser?.name || inv.fromUser?.email || 'someone'
              return (
                <li key={id} style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <div style={{ fontSize: 14 }}>
                    You were invited to <strong>{projectTitle}</strong> by <strong>{inviter}</strong>.
                  </div>
                  <div style={{ marginTop: 6, display: 'flex', gap: 8 }}>
                    <button onClick={() => handleAccept(id)}>Accept</button>
                    <button onClick={() => handleDecline(id)} style={{ color: '#c00' }}>Decline</button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
