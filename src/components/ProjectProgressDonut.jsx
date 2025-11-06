import React from 'react'
import { Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend, Title)

export default function ProjectProgressDonut({ value = 41, scale = 1, offsetX = 0, offsetY = 0, cutout = '68%' }) {
  const data = {
    labels: ['Completed', 'Remaining'],
    datasets: [
      {
        data: [value, Math.max(0, 100 - value)],
        backgroundColor: ['#10B981', '#E5E7EB'],
        borderWidth: 0,
        hoverOffset: 0,
        borderRadius: 0,
        spacing: 0,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1,
    cutout,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: { enabled: true },
    },
  }

  return (
    <div style={{ position: 'relative', height: '100%', overflow: 'hidden', display: 'grid', placeItems: 'center' }}>
      <div style={{ width: '100%', maxHeight: '100%', aspectRatio: '1 / 1', transform: `scale(${scale}) translate(${offsetX}%, ${offsetY}%)`, transformOrigin: 'center' }}>
        <Doughnut data={data} options={options} />
      </div>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 28, fontWeight: 700, color: '#1F2937' }}>{value}%</div>
        <div style={{ fontSize: 12, color: '#6B7280' }}>Project Ended</div>
      </div>
    </div>
  )
}
