import { ApplicationContextProvider } from '@gatherwise/common-frontend-libs/components/ApplicationContext'
import { AuthModule } from '@gatherwise/common-frontend-libs/libs/authentication'
import { useEffect } from 'react'
import './App.css'
import addIcons from './libs/add-icons'
import './libs/localization'
import logoFull from './logos/logo-full.svg'
import { getRouter } from './routes'

addIcons()
AuthModule.setClientId('frontend')

const sitePreferences = {
  title: 'Gatherwise',
  logo: logoFull,
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
