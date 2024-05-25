import React from 'react'
import { Link, useRouteError } from 'react-router-dom'
import PrimaryButton from '../components/materials/Button/PrimaryButton'
import SecondaryButton from '../components/materials/Button/SecondaryButton'
import { useLocalize } from '../libs/localization'

export default function ErrorBoundary() {
  const error = useRouteError()
  const localize = useLocalize()

  console.error('[ErrorBoundary]', error)
  return (
    <div className='m-auto w-2/3 p-8 text-center'>
      <p className='p-2 text-2xl font-bold'>{localize('something wrong happens')}</p>
      <p className='mb-4 p-2 text-xl font-bold text-midnight-500'>{error?.message ?? ''}</p>
      <pre className='text-md mb-4 p-2 text-left font-sans text-midnight-400'>{error?.stack ?? ''}</pre>
      <div className='space-x-4'>
        <PrimaryButton>
          <Link to={'/'}>{localize('return to homepage')}</Link>
        </PrimaryButton>
        <SecondaryButton>
          <Link to={-1}>{localize('back')}</Link>
        </SecondaryButton>
      </div>
    </div>
  )
}
