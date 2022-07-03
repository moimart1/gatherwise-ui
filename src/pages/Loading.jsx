import React from 'react'
import { Link } from 'react-router-dom'
import { localize } from '../libs/localization'

export default function Loading({ lang, showReload = false }) {
  return (
    <div className='w-full text-center p-8'>
      <p className='text-xl font-bold text-gray-500 p-4'>{localize('loading')(lang)}...</p>
      {showReload && (
        <div className='space-x-4'>
          <button {...{ onClick: () => {} }}>
            <Link to={'/'}>{localize('return to homepage')(lang)}</Link>
          </button>
          <button onClick={() => window.location.reload()}>{localize('reload')(lang)}</button>
        </div>
      )}
    </div>
  )
}
