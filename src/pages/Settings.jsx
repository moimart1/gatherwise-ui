import React, { useContext } from 'react'
import { LanguageContext, localize } from '../libs/localization'

const Settings = () => {
  const lang = useContext(LanguageContext)

  return (
    <div className='h-screen space-x-3'>
      <h1 className='py-3'>{localize('user')(lang)}</h1>
      <pre className='text-xs'></pre>
    </div>
  )
}

export default Settings
