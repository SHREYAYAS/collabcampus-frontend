import React, { useEffect, useMemo, useState } from 'react'
import { Box, Typography } from '@mui/material'

// A lightweight, custom-rendered weekly analytics bar display styled to match the
// Donezo reference: rounded capsule bars, some striped, day labels, and a small
// percentage badge above the best-performing day.

export default function AnalyticsChart({ range = '7d', values }) {
  // Days order as shown in the reference (Sun..Sat): S M T W T F S
  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

  // Choose sample data if none provided
  const sample7 = [6, 10, 18, 14, 8, 5, 12]
  const sample30 = [5, 8, 12, 11, 7, 6, 10]
  const data = values && values.length === 7
    ? values
    : (range === '30d' ? sample30 : sample7)

  const { maxVal, maxIndex, percents } = useMemo(() => {
    const max = Math.max(1, ...data)
    const idx = data.indexOf(max)
    const pct = data.map((v) => Math.round((v / max) * 100))
    return { maxVal: max, maxIndex: idx, percents: pct }
  }, [data])

  // Which bars should be striped per the reference vibe
  const stripedSet = new Set([0, 4, 6]) // Sun, Thu, Sat

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30)
    return () => clearTimeout(t)
  }, [])

  return (
    <Box sx={{ position: 'relative', height: 200, px: { xs: 1, sm: 2 }, pt: 1 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          height: '100%',
          pb: 3,
          gap: { xs: 1.25, sm: 2 }, // even spacing between bars
        }}
      >
        {data.map((v, i) => {
          const h = Math.max(8, Math.min(percents[i], 100)) // ensure a tiny visible bar
          const isStriped = stripedSet.has(i)
          const isMax = i === maxIndex
          return (
            <Box key={i} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: { xs: 26, sm: 30 } }}>
              {/* Track */}
              <Box sx={{ position: 'relative', height: 152, width: '100%', borderRadius: 999, backgroundColor: 'rgba(16,185,129,0.10)', overflow: 'hidden', boxShadow: 'inset 0 0 0 1px rgba(16,185,129,0.06)', transition: 'box-shadow 200ms ease', '&:hover': { boxShadow: 'inset 0 0 0 1px rgba(16,185,129,0.12), 0 6px 18px rgba(16,185,129,0.15)' }, '&:hover .cc-fill': { filter: 'brightness(1.06)' } }}>
                {/* Fill */}
                <Box
                  className="cc-fill"
                  sx={{
                    position: 'absolute',
                    left: 0,
                    bottom: 0,
                    width: '100%',
                    height: mounted ? `${h}%` : '0%',
                    borderRadius: 999,
                    background: isStriped
                      ? 'repeating-linear-gradient(-45deg, rgba(16,185,129,0.45) 0 6px, rgba(16,185,129,0.15) 6px 12px)'
                      : 'linear-gradient(180deg, rgba(16,185,129,0.95) 0%, rgba(16,185,129,0.65) 100%)',
                    transition: 'height 600ms cubic-bezier(0.22, 1, 0.36, 1)',
                    transformOrigin: 'bottom',
                    animation: mounted ? 'bump 450ms ease-out 650ms 1' : 'none',
                    '@keyframes bump': {
                      '0%': { transform: 'scaleY(1)' },
                      '60%': { transform: 'scaleY(1.06)' },
                      '100%': { transform: 'scaleY(1)' },
                    },
                  }}
                />

                {/* Peak day badge */}
                {isMax && (
                  <Box
                    sx={{
                      position: 'absolute',
                      left: '50%',
                      bottom: `${h}%`,
                      transform: 'translate(-50%, -8px)',
                      backgroundColor: 'background.paper',
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 999,
                      px: 0.75,
                      py: 0.25,
                      fontSize: 12,
                      boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                      color: 'text.primary',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <Box component="span" sx={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', bgcolor: '#10B981', mr: 0.5 }} />
                    {Math.round((data[i] / maxVal) * 100)}%
                  </Box>
                )}
              </Box>
              {/* Day label */}
              <Typography variant="caption" sx={{ mt: 0.5, color: 'text.secondary' }}>{dayLabels[i]}</Typography>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}
