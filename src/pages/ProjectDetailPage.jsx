import React from 'react'
import { useParams, Link } from 'react-router-dom'

export default function ProjectDetailPage() {
  const { projectId } = useParams()

  return (
    <div style={{ padding: '20px', maxWidth: 800, margin: 'auto' }}>
      <h1>Project</h1>
      <p>Project ID: <code>{projectId}</code></p>
      <p>This is a placeholder page. We can fetch and render the project details next.</p>
      <p><Link to="/dashboard">← Back to Dashboard</Link></p>
    </div>
  )
}
