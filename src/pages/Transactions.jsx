import React, { useContext } from 'react'
import { LanguageContext, localize } from '../libs/localization'

export default function Transactions() {
  const lang = useContext(LanguageContext)

  return <div className=''>{localize('transactions')(lang)}</div>
}
