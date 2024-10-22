import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export default function Loading({ showReload = false }) {
  const { t } = useTranslation('pages/loading')
  return (
    <div className='w-full p-8 text-center'>
      <p className='p-4 text-xl font-bold text-gray-500'>{t('loading')}...</p>
      {showReload && (
        <div className='space-x-4'>
          <button {...{ onClick: () => {} }}>
            <Link to={'/'}>{t('return-to-homepage')}</Link>
          </button>
          <button onClick={() => window.location.reload()}>Reload</button>
        </div>
      )}
    </div>
  )
}
