import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './contexts/ThemeContext'
import { ProgressProvider } from './contexts/ProgressContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <ProgressProvider>
        <App />
      </ProgressProvider>
    </ThemeProvider>
  </StrictMode>,
)
