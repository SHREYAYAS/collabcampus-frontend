import React, { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import { getToken } from '../api/client'

// Minimal chat component per spec
// Props:
// - projectId: string
// - initialMessages: [{ sender: { username }, content, createdAt? }, ...]
// - user: current user object (for optimistic send display)
export default function Chat({ projectId, initialMessages = [], user }) {
  const [connected, setConnected] = useState(false)
  const [messages, setMessages] = useState(() => initialMessages)
  const [text, setText] = useState('')
  const listRef = useRef(null)
  const socketRef = useRef(null)

  // keep messages in sync if parent provides new history
  useEffect(() => {
    setMessages(initialMessages)
  }, [initialMessages])

  // socket connection and event listener
  useEffect(() => {
    const base = import.meta.env.VITE_API_URL || window.location.origin
    const token = getToken()
    const socket = io(base, {
      path: '/socket.io',
      transports: ['websocket'],
      auth: token ? { token, projectId } : { projectId },
      withCredentials: true,
    })
    socketRef.current = socket

    socket.on('connect', () => setConnected(true))
    socket.on('disconnect', () => setConnected(false))

    // Listen for new messages and append
    socket.on('new_message', (msg) => {
      if (!msg) return
      setMessages((prev) => [...prev, msg])
    })

    return () => {
      socket.off('new_message')
      socket.disconnect()
    }
  }, [projectId])

  // auto-scroll to bottom on update
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = (e) => {
    e.preventDefault()
    const content = text.trim()
    if (!content) return
    setText('')

    // optimistic render using provided user
    const optimistic = {
      content,
      sender: user ? { username: user.username || user.name || user.email } : { username: 'me' },
      projectId,
      createdAt: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, optimistic])

    const s = socketRef.current
    if (s && s.connected) {
      s.emit('send_message', { projectId, content })
    }
  }

  return (
    <div style={{ marginTop: 24 }}>
      <h3>Project Chat {connected ? '• Online' : '• Offline'}</h3>
      <div
        ref={listRef}
        style={{
          border: '1px solid #ddd',
          borderRadius: 8,
          height: 220,
          overflowY: 'auto',
          padding: 10,
          background: '#fafafa',
        }}
      >
        {messages.length === 0 ? (
          <p style={{ color: '#777' }}>No messages yet. Say hi!</p>
        ) : (
          messages.map((m, idx) => (
            <div key={m.id || m._id || m.createdAt || idx} style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 12, color: '#555' }}>
                {m.sender?.username || 'anonymous'} · {new Date(m.createdAt || Date.now()).toLocaleTimeString()}
              </div>
              <div>{m.content}</div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={sendMessage} style={{ marginTop: 8, display: 'flex', gap: 8 }}>
        <input
          placeholder="Type a message"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ flex: 1 }}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  )
}
