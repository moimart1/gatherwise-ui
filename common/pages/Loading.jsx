import React from 'react'
import { Link } from 'react-router-dom'
import PrimaryButton from '../components/materials/Button/PrimaryButton'
import SecondaryButton from '../components/materials/Button/SecondaryButton'
import { useLocalize } from '../libs/localization'

export default function Loading({ showReload = false }) {
  const localize = useLocalize()

  return (
    <div className='w-full p-8 text-center'>
      <p className='p-4 text-xl font-bold'>{localize('loading')}...</p>
      {showReload && (
        <div className='space-x-4'>
          <PrimaryButton {...{ onClick: () => {} }}>
            <Link to={'/'}>{localize('return to homepage')}</Link>
          </PrimaryButton>
          <SecondaryButton onClick={() => window.location.reload()}>{localize('reload')}</SecondaryButton>
        </div>
      )}
    </div>
  )
}
