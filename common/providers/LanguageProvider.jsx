import { useState } from 'react'
import { langEnum, LanguageContext } from '../libs/localization'

export { useLang, useLanguageContext } from '../libs/localization'

export default function LanguageProvider({ children }) {
  const [lang, setLang] = useState(langEnum.en)
  return <LanguageContext.Provider value={{ lang, setLang }}>{children}</LanguageContext.Provider>
}
