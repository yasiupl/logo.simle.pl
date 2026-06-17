import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import SimLELogoCreator from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SimLELogoCreator />
  </StrictMode>,
)
