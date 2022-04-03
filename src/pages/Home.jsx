import React, { useContext } from 'react'
import { LanguageContext, localize } from '../libs/localization'

export default function Home() {
  const lang = useContext(LanguageContext)

  return <div className=''>{localize('home')(lang)}</div>
}
