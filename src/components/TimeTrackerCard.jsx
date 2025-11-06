import React, { useEffect, useRef, useState } from 'react'
import { Box, Stack, Typography, IconButton, Tooltip } from '@mui/material'
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'
import PauseRoundedIcon from '@mui/icons-material/PauseRounded'
import StopRoundedIcon from '@mui/icons-material/StopRounded'
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded'

function format(seconds) {
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0')
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0')
  const s = Math.floor(seconds % 60).toString().padStart(2, '0')
  return `${h}:${m}:${s}`
}

export default function TimeTrackerCard() {
  const [running, setRunning] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    if (running) {
      ref.current = setInterval(() => setSeconds((s) => s + 1), 1000)
    }
    return () => ref.current && clearInterval(ref.current)
  }, [running])

  const handleReset = () => {
    setRunning(false)
    setSeconds(0)
  }

  const handleStop = () => {
    setRunning(false)
  }

  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        borderRadius: 24,
        p: 2,
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'linear-gradient(145deg, #115F40 0%, #0E4030 55%, #082D22 100%)',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'inset 0 0 60px rgba(0,0,0,0.18)',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/textures/time-tracker-wave.svg)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.7,
          mixBlendMode: 'soft-light',
          pointerEvents: 'none'
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(1200px 400px at -10% 120%, rgba(255,255,255,0.10), transparent 60%), radial-gradient(700px 300px at 120% -20%, rgba(255,255,255,0.08), transparent 60%), repeating-conic-gradient(from 0deg at 120% 0%, rgba(255,255,255,0.06) 0deg, rgba(255,255,255,0.00) 10deg 20deg), linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0) 40%)'
          ,
          opacity: 0.45,
          pointerEvents: 'none'
        }
      }}
    >
      <Box sx={{ width: '100%' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'rgba(255,255,255,0.9)', letterSpacing: 0.2 }}>
          Time Tracker
        </Typography>
      </Box>

      <Stack alignItems="center" spacing={0.5} sx={{ mt: 0.25 }}>
        <Typography
          component="div"
          sx={{
            fontSize: { xs: 48, md: 60 },
            lineHeight: 1,
            fontWeight: 800,
            letterSpacing: 1,
            color: '#fff',
            textShadow: '0 6px 18px rgba(0,0,0,0.25)'
          }}
        >
          {format(seconds)}
        </Typography>
      </Stack>

      <Box sx={{ display: 'flex', gap: 1.25, mb: 0.5, width: '100%', justifyContent: 'flex-start' }}>
        {!running ? (
          <Tooltip title="Start">
            <IconButton
              aria-label="start"
              onClick={() => setRunning(true)}
              sx={{
                width: 54,
                height: 54,
                bgcolor: '#16A34A',
                color: '#fff',
                boxShadow: '0 10px 22px rgba(0,0,0,0.25), 0 0 0 6px rgba(22,163,74,0.18)',
                '&:hover': { bgcolor: '#15803D', boxShadow: '0 12px 26px rgba(0,0,0,0.30), 0 0 0 6px rgba(21,128,61,0.22)' }
              }}
            >
              <PlayArrowRoundedIcon sx={{ fontSize: 30 }} />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Pause">
            <IconButton
              aria-label="pause"
              onClick={() => setRunning(false)}
              sx={{
                width: 54,
                height: 54,
                bgcolor: '#FFFFFF',
                color: '#14532D',
                boxShadow: '0 10px 22px rgba(0,0,0,0.20)',
                '&:hover': { bgcolor: '#F3F4F6' }
              }}
            >
              <PauseRoundedIcon sx={{ fontSize: 30 }} />
            </IconButton>
          </Tooltip>
        )}

        <Tooltip title={running ? 'Stop' : 'Reset'}>
          <IconButton
            aria-label={running ? 'stop' : 'reset'}
            onClick={running ? handleStop : handleReset}
            sx={{
              width: 48,
              height: 48,
              bgcolor: running ? '#DC2626' : 'rgba(255,255,255,0.10)',
              color: '#fff',
              border: running ? 'none' : '1px solid rgba(255,255,255,0.35)',
              boxShadow: running ? '0 10px 22px rgba(0,0,0,0.25)' : 'none',
              '&:hover': { bgcolor: running ? '#B91C1C' : 'rgba(255,255,255,0.18)' }
            }}
          >
            {running ? <StopRoundedIcon sx={{ fontSize: 26 }} /> : <RestartAltRoundedIcon sx={{ fontSize: 26 }} />}
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  )
}
