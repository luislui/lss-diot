import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.tsx'
import faviconUrl from './assets/images/logo_loeram_favicon.png'

const storedTheme = typeof window !== 'undefined' ? localStorage.getItem('lss-theme') : null
const isDark = storedTheme ? storedTheme === 'dark' : true
if (isDark) document.documentElement.classList.add('dark')
else document.documentElement.classList.remove('dark')

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
        className: 'dark:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-600',
      }}
    />
  </StrictMode>,
)
