import React, { useState } from 'react'
import { useRoutes } from 'react-router-dom'
import './App.css'
import AuthProvider from './components/AuthProvider'
import addIcons from './libs/add-icons'
import { langEnum, LanguageContext } from './libs/localization'
import { compileRoutes } from './libs/routes'
import logoFull from './logos/logo-full.svg'
import routes from './routes'

addIcons()

const sitePreferences = {
  title: 'Gatherwise',
  logo: logoFull,
}

function App() {
  const [lang, setLang] = useState(langEnum.en)
  const onChangeLanguage = (event) => {
    setLang(event.target.value)
  }

  const currentPage = useRoutes(
    compileRoutes(routes({ lang }), { sitePreferences, onChangeLanguage })
  )

  return (
    <>
      <LanguageContext.Provider value={lang}>
        <AuthProvider clientId='frontend' lang={lang}>
          {currentPage}
        </AuthProvider>
      </LanguageContext.Provider>
    </>
  )
}

export default App
