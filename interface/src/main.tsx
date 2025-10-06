import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@primer/css/dist/primer.css'
import 'github-markdown-css/github-markdown.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
