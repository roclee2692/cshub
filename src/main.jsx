import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import 'katex/dist/katex.min.css'
import './index.css'
import App from './App.jsx'

const AppProviders = lazy(() => import('./AppProviders.jsx'))

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Suspense fallback={null}>
      <AppProviders>
        <App />
      </AppProviders>
    </Suspense>
  </StrictMode>,
)
