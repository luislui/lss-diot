import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.tsx'

document.documentElement.classList.add('dark')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 5000,
        style: { maxWidth: 420 },
        className: 'dark:bg-slate-800 dark:text-slate-200 dark:border-slate-600',
      }}
    />
  </StrictMode>,
)
