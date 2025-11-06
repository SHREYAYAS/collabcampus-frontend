import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { createTheme } from '@mui/material/styles'

// Light mode theme inspired by "Donezo" style
const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#F9FAFB', // very light gray page background
      paper: '#FFFFFF',   // pure white card surfaces
    },
    primary: {
      main: '#10B981', // vibrant green
    },
    text: {
      primary: '#1F2937',   // dark gray for primary text
      secondary: '#6B7280', // lighter gray for secondary text
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
)