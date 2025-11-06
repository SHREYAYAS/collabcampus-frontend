import React, { useEffect, useMemo, useState } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import client from '../api/client'

// Columns we support by default
const DEFAULT_COLUMNS = [
  { key: 'todo', title: 'To Do' },
  { key: 'in_progress', title: 'In Progress' },
  { key: 'done', title: 'Done' },
]

function normalizeStatus(value) {
  if (!value) return 'todo'
  const raw = String(value)
  const v = raw.toLowerCase().replace(/\s+/g, '-')
  // Common variants mapping to our 3 columns
  if (
    v === 'in-progress' ||
    v === 'in_progress' ||
    v === 'progress' ||
    v === 'doing' ||
    v === 'inprogress' ||
    raw === 'IN_PROGRESS'
  ) return 'in_progress'

  if (
    v === 'done' ||
    v === 'completed' ||
    v === 'complete' ||
    raw === 'DONE' ||
    raw === 'COMPLETED'
  ) return 'done'

  // Treat anything else as TODO-like
  // Includes: todo, to-do, TO_DO, TODO, not-started, NOT_STARTED, backlog
  return 'todo'
}

function groupByStatus(tasks) {
  const columns = { todo: [], in_progress: [], done: [] }
  tasks.forEach((t) => {
    const key = normalizeStatus(t.status || t.stage)
    columns[key].push(t)
  })
  return columns
}

export default function KanbanBoard({ projectId, initialTasks = [], showCreateForm = true }) {
  const [columns, setColumns] = useState({ todo: [], in_progress: [], done: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [newTitle, setNewTitle] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')

  const columnDefs = useMemo(() => DEFAULT_COLUMNS, [])

  const loadTasks = async () => {
    setLoading(true)
    setError('')
    try {
      // First try: GET /projects/:id/tasks
      try {
        const { data } = await client.get(`/projects/${encodeURIComponent(projectId)}/tasks`)
        const tasks = Array.isArray(data) ? data : (data?.tasks || [])
        setColumns(groupByStatus(tasks))
      } catch (err) {
        if (err?.response?.status === 404) {
          // Fallback: GET /projects/:id and use .tasks
          const { data } = await client.get(`/projects/${encodeURIComponent(projectId)}`)
          const project = data?.project ?? data
          const tasks = Array.isArray(project?.tasks) ? project.tasks : []
          setColumns(groupByStatus(tasks))
        } else {
          throw err
        }
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.msg || err.message
      setError(msg || 'Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (initialTasks && initialTasks.length) {
      setColumns(groupByStatus(initialTasks))
      setLoading(false)
    } else {
      loadTasks()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId])

  // Reflect updates when parent provides a new initialTasks array (e.g., after creating a task)
  useEffect(() => {
    if (Array.isArray(initialTasks)) {
      setColumns(groupByStatus(initialTasks))
    }
  }, [initialTasks])

  const attemptPersist = async ({ projectId, taskId, destCol, position }) => {
    const makeVariants = (col) => {
      const base = col === 'in_progress' ? 'in-progress' : col
      const map = {
        // Include many backend enum variants so we rarely mismatch
        todo: ['todo', 'To Do', 'TO_DO', 'to-do', 'TODO', 'Not Started', 'NOT_STARTED', 'not-started', 'backlog', 'BACKLOG'],
        in_progress: [
          'in-progress',
          'in_progress',
          'IN_PROGRESS',
          'In Progress',
          'inProgress',
          'progress',
          'doing'
        ],
        done: ['done', 'Done', 'DONE', 'completed', 'Completed', 'COMPLETED', 'complete', 'Complete'],
      }
      return map[col] || [base]
    }

    const statusVariants = makeVariants(destCol)
    const payloadVariants = []
    for (const v of statusVariants) {
      payloadVariants.push({ status: v, position })
      payloadVariants.push({ stage: v, position })
      payloadVariants.push({ column: v, index: position })
      payloadVariants.push({ state: v, order: position })
      payloadVariants.push({ status: v })
    }

    const endpoints = [
      { method: 'patch', url: `/projects/${encodeURIComponent(projectId)}/tasks/${encodeURIComponent(taskId)}` },
      { method: 'put', url: `/projects/${encodeURIComponent(projectId)}/tasks/${encodeURIComponent(taskId)}` },
      { method: 'patch', url: `/tasks/${encodeURIComponent(taskId)}` },
      { method: 'put', url: `/tasks/${encodeURIComponent(taskId)}` },
      { method: 'patch', url: `/projects/${encodeURIComponent(projectId)}/task/${encodeURIComponent(taskId)}` },
      { method: 'patch', url: `/tasks/${encodeURIComponent(taskId)}/status` },
    ]

    for (const ep of endpoints) {
      for (const payload of payloadVariants) {
        try {
          const res = await client[ep.method](ep.url, payload)
          if (res && res.status >= 200 && res.status < 300) {
            return true
          }
        } catch {
          // Continue trying other variants
          // console.debug('Persist attempt failed', { ep, payload, err: err?.response?.data || err?.message })
        }
      }
    }
    return false
  }

  const onDragEnd = async (result) => {
    const { source, destination } = result
    if (!destination) return
    const sourceCol = source.droppableId
    const destCol = destination.droppableId
    if (sourceCol === destCol && source.index === destination.index) return

    // Work on a copy for immutability
    const next = {
      todo: [...columns.todo],
      in_progress: [...columns.in_progress],
      done: [...columns.done],
    }
    const prev = {
      todo: [...columns.todo],
      in_progress: [...columns.in_progress],
      done: [...columns.done],
    }

    // Remove from source
    const [moved] = next[sourceCol].splice(source.index, 1)
    // Insert into destination
    next[destCol].splice(destination.index, 0, moved)

    // Update local state immediately (optimistic)
    setColumns(next)

    // Persist to backend if moved across columns or position changed
    const ok = await attemptPersist({
      projectId,
      taskId: moved.id || moved._id,
      destCol,
      position: destination.index,
    })
    if (!ok) {
      console.error('Failed to persist drag result; reverting UI')
      setColumns(prev)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setCreateError('')
    if (!newTitle.trim()) {
      setCreateError('Task title is required')
      return
    }
    setCreating(true)
    try {
      // Omit status to let server default it; include both title and name
      const payload = {
        title: newTitle.trim(),
        name: newTitle.trim(),
        description: newDesc.trim(),
      }
      const { data } = await client.post(`/projects/${encodeURIComponent(projectId)}/tasks`, payload)
      const created = data?.task || data
      const key = normalizeStatus(created.status || created.stage)
      setColumns((prev) => ({ ...prev, [key]: [created, ...(prev[key] || [])] }))
      setNewTitle('')
      setNewDesc('')
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.msg || err.message
      setCreateError(msg || 'Failed to create task')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div style={{ marginTop: 16 }}>
      <h3>Tasks</h3>
      {/* Create new task (can be hidden by parent) */}
      {showCreateForm && (
        <form onSubmit={handleCreate} style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              placeholder="New task title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              style={{ flex: '0 1 260px' }}
            />
            <input
              placeholder="Description (optional)"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              style={{ flex: '1 1 360px' }}
            />
            <button type="submit" disabled={creating}>{creating ? 'Adding...' : 'Add Task'}</button>
          </div>
          {createError && <p style={{ color: 'red' }}>{createError}</p>}
        </form>
      )}

      {loading && <p>Loading tasks...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && (
        <DragDropContext onDragEnd={onDragEnd}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {columnDefs.map((col) => (
              <Droppable droppableId={col.key} key={col.key}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{
                      background: snapshot.isDraggingOver ? '#f0f7ff' : '#f6f6f6',
                      minHeight: 300,
                      borderRadius: 8,
                      padding: 10,
                    }}
                  >
                    <h4 style={{ marginTop: 0 }}>{col.title}</h4>
                    {(columns[col.key] || []).map((task, index) => (
                      <Draggable draggableId={String(task.id || task._id)} index={index} key={task.id || task._id}>
                        {(providedDraggable, snapshotDraggable) => (
                          <div
                            ref={providedDraggable.innerRef}
                            {...providedDraggable.draggableProps}
                            {...providedDraggable.dragHandleProps}
                            style={{
                              background: 'white',
                              borderRadius: 6,
                              padding: 10,
                              marginBottom: 8,
                              boxShadow: snapshotDraggable.isDragging ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
                              ...providedDraggable.draggableProps.style,
                            }}
                          >
                            <strong>{task.title || task.name || 'Untitled task'}</strong>
                            {task.description ? (
                              <div style={{ color: '#555' }}>{task.description}</div>
                            ) : null}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      )}
    </div>
  )
}
