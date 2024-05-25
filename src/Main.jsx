import { serviceEnum } from '@gatherwise/common-frontend-libs/libs/constants'
import { setUrlInfo } from '@gatherwise/common-frontend-libs/libs/urls'
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

setUrlInfo(serviceEnum.admin, {
  developmentBackends: {
    [serviceEnum.admin]: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
  },
})

const container = document.getElementById('root')
const root = createRoot(container)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
