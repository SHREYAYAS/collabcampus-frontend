import React, { useMemo } from 'react'
import { Chart } from 'react-google-charts'

// Convert app tasks -> Google Gantt rows
// Google Gantt expects rows shaped as:
// [
//   'Task ID', 'Task Name', 'Resource', StartDate, EndDate, DurationMs, PercentComplete, 'Dependencies'
// ]
// Either provide Start+End (Duration null) or Start+Duration (End null).
function toGanttRows(tasks = []) {
  const rows = []
  tasks.forEach((t, idx) => {
    const id = String(t.id || t._id || idx)
    const name = t.title || t.name || 'Untitled'

    // Resource column: show assigned user's username if present, else 'Unassigned'
    const resource = (t.assignedTo && typeof t.assignedTo === 'object')
      ? (t.assignedTo.username || 'Unassigned')
      : 'Unassigned'

    // Dates: prefer explicit start/end or dueDate; fall back to createdAt and +1 day
    const startRaw = t.startDate || t.start || t.createdAt
    const dueRaw = t.dueDate || t.endDate || t.end

    const start = startRaw ? new Date(startRaw) : new Date()
    // If end missing or invalid, default to start + 1 day
    const end = dueRaw ? new Date(dueRaw) : new Date(start.getTime() + 24 * 60 * 60 * 1000)

    // Duration: if both start & end exist, set duration null (Google will use the dates)
    // Otherwise derive from duration fields if present
    let duration = null
    if (!dueRaw && (t.durationMs || t.durationDays)) {
      duration = t.durationMs || (t.durationDays * 24 * 60 * 60 * 1000)
    }

    // Completion based on explicit value or map from status
    let pct = Number.isFinite(t.percentComplete) ? t.percentComplete : undefined
    if (!Number.isFinite(pct)) {
      const status = String(t.status || t.stage || '').toLowerCase()
      if (status === 'done' || status === 'completed' || status === 'complete') pct = 100
      else if (status === 'in_progress' || status === 'in-progress' || status === 'doing' || status === 'progress') pct = 50
      else pct = 0
    }

    // Dependencies: accept array of ids or task objects, or comma string
    let deps = null
    if (Array.isArray(t.dependencies)) {
      deps = t.dependencies
        .map((d, i) => {
          if (typeof d === 'string') return d
          if (d && typeof d === 'object') return String(d.id || d._id || i)
          return null
        })
        .filter(Boolean)
        .join(',') || null
    } else if (typeof t.dependencies === 'string') {
      deps = t.dependencies
    }

    rows.push([id, name, resource, start, end, duration, Math.max(0, Math.min(100, pct)), deps])
  })
  return rows
}

export default function GanttChart({ tasks = [] }) {
  const columns = useMemo(
    () => [
      { type: 'string', label: 'Task ID' },
      { type: 'string', label: 'Task Name' },
      { type: 'string', label: 'Resource' },
      { type: 'date', label: 'Start Date' },
      { type: 'date', label: 'End Date' },
      { type: 'number', label: 'Duration' },
      { type: 'number', label: 'Percent Complete' },
      { type: 'string', label: 'Dependencies' },
    ],
    []
  )

  const rows = useMemo(() => toGanttRows(Array.isArray(tasks) ? tasks : []), [tasks])

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <Chart
        chartType="Gantt"
        width="100%"
        height="320px"
        columns={columns}
        rows={rows}
        loader={<div>Loading Gantt…</div>}
        options={{
          gantt: {
            trackHeight: 28,
          },
        }}
      />
    </div>
  )
}
