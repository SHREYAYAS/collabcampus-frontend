import React from 'react'
import { Box, Paper, Stack, Typography, IconButton, Tooltip } from '@mui/material'
import OpenInNewIcon from '@mui/icons-material/ArrowOutward'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'

// Props:
// - title, value
// - subtitle (string)
// - trend: 'up' | 'down' | 'none' (controls arrow and default color)
// - icon: optional right-side small icon
// - sx, titleColor, valueColor, subtitleColor, trendColor: style overrides
export default function StatCard({
  title,
  value,
  subtitle = 'Increased from last month',
  trend = 'up',
  icon,
  sx,
  titleColor,
  valueColor,
  subtitleColor,
  trendColor,
  subtitleAsBadge = false,
  badgeBg,
  badgeColor,
  showCornerArrow = false,
  onCornerClick,
  cornerTooltip,
  cornerSx,
  iconBoxSx,
}) {
  const defaultTrendColor = trend === 'down' ? '#EF4444' : '#10B981'
  const captionColor = subtitleColor || (trend === 'none' ? 'text.secondary' : defaultTrendColor)
  const arrowColor = trendColor || subtitleColor || (trend === 'none' ? 'text.secondary' : defaultTrendColor)

  return (
  <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', borderRadius: 20, border: '1px solid', borderColor: 'divider', boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 6px 20px rgba(0,0,0,0.06)', bgcolor: 'background.paper', ...sx }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography variant="h6" sx={{ color: titleColor }}>{title}</Typography>
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
          {icon && (
            <Box sx={{ bgcolor: 'background.default', borderRadius: 2, p: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', ...iconBoxSx }}>
              {icon}
            </Box>
          )}
          {showCornerArrow && (
            <Tooltip title={cornerTooltip || `Open ${title}`} arrow>
              <IconButton
                size="small"
                onClick={onCornerClick}
                aria-label={cornerTooltip || `Open ${title}`}
                sx={{
                  bgcolor: 'background.default',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: '50%',
                  '&:hover': { bgcolor: 'action.hover' },
                  ...cornerSx,
                }}
              >
                <OpenInNewIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Stack>
      <Typography variant="h3" fontWeight="bold" sx={{ color: valueColor }}>{value}</Typography>
      {subtitle && !subtitleAsBadge && (
        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.5, color: captionColor }}>
          {trend !== 'none' && (
            trend === 'down' ? (
              <ArrowDownwardIcon fontSize="inherit" sx={{ color: arrowColor }} />
            ) : (
              <ArrowUpwardIcon fontSize="inherit" sx={{ color: arrowColor }} />
            )
          )}
          <Typography variant="body2" sx={{ color: captionColor }}>{subtitle}</Typography>
        </Stack>
      )}
      {subtitle && subtitleAsBadge && (
        <Box sx={{ mt: 1 }}>
          <Box
            component="span"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              px: 1,
              py: 0.25,
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 600,
              bgcolor: badgeBg || (trend === 'down' ? 'rgba(239,68,68,0.12)' : 'rgba(16,185,129,0.12)'),
              color: badgeColor || (trend === 'down' ? '#EF4444' : '#10B981'),
            }}
          >
            {trend !== 'none' && (
              trend === 'down' ? (
                <ArrowDownwardIcon sx={{ fontSize: 14 }} />
              ) : (
                <ArrowUpwardIcon sx={{ fontSize: 14 }} />
              )
            )}
            {subtitle}
          </Box>
        </Box>
      )}
    </Paper>
  )
}
