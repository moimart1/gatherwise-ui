import { ApplicationContextProvider } from '@gatherwise/common-frontend-libs/components/ApplicationContext'
import { AuthModule } from '@gatherwise/common-frontend-libs/libs/authentication'
import { gatherwiseMidnightSolid } from '@gatherwise/common-frontend-libs/logos'
import { useEffect } from 'react'
import './App.css'
import addIcons from './libs/add-icons'
import './libs/localization'
import { getRouter } from './routes'

addIcons()
AuthModule.setClientId('frontend')

const sitePreferences = {
  title: 'Admin',
  logo: gatherwiseMidnightSolid,
}

const router = getRouter({ sitePreferences })

export default function App() {
  useEffect(() => {
    console.log('[App] initialized')
    return () => {
      console.log('[App] cleaned')
    }
  }, []) // Global unmount

  console.log('[App] loaded')
  return <ApplicationContextProvider router={router} />
}
