import React, { useMemo } from 'react'
import { Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend, Title)

export default function ProjectStatusChart({ tasks = [] }) {
  const counts = useMemo(() => {
    const total = { completed: 0, progress: 0, pending: 0 }
    for (const t of tasks) {
      const s = (t.status || '').toLowerCase()
      if (s === 'done' || s === 'completed' || s === 'complete') total.completed++
      else if (s === 'in progress' || s === 'progress' || s === 'running') total.progress++
      else total.pending++
    }
    return total
  }, [tasks])

  const data = {
    labels: ['Completed', 'In Progress', 'Pending'],
    datasets: [
      {
        data: [counts.completed, counts.progress, counts.pending],
        backgroundColor: ['#10B981', '#34D399', '#E5E7EB'],
        borderWidth: 0,
        borderRadius: 8,
        spacing: 3,
      },
    ],
  }
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: { legend: { display: false }, title: { display: false } },
  }

  const total = counts.completed + counts.progress + counts.pending

  return (
    <div style={{ position: 'relative', height: 220 }}>
      <Doughnut data={data} options={options} />
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
        <div style={{ fontSize: 22, fontWeight: 700 }}>{total}</div>
        <div style={{ fontSize: 12, color: '#6B7280' }}>Tasks</div>
      </div>
    </div>
  )
}
