import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import { router } from './app/router'
import { useAuthStore } from './features/auth/store'

// AUTH-05: pulihkan sesi dari token sebelum guard memutuskan ke mana user diarahkan.
void useAuthStore.getState().bootstrap()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
