import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.tsx'
import faviconUrl from './assets/images/logo_loeram_favicon.png'

document.documentElement.classList.add('dark')

const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]') ?? document.createElement('link')
link.rel = 'icon'
link.type = 'image/png'
link.href = faviconUrl
if (!document.querySelector('link[rel="icon"]')) document.head.appendChild(link)

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
