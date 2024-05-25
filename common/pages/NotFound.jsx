import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import PrimaryButton from '../components/materials/Button/PrimaryButton'
import SecondaryButton from '../components/materials/Button/SecondaryButton'
import { useLocalize } from '../libs/localization'

const NotFound = ({ children }) => {
  const location = useLocation()
  const localize = useLocalize()
  const navigate = useNavigate()

  return (
    <div className='w-full p-8 text-center'>
      <p className='text-xl font-bold'>{localize('not found')}</p>
      <p>{location.pathname}</p>

      <div className='flex flex-row items-center justify-center space-x-4 p-8'>
        <PrimaryButton {...{ onClick: () => {} }}>
          <Link to={'/'}>{localize('return to homepage')}</Link>
        </PrimaryButton>
        <SecondaryButton onClick={() => navigate(-1)}>{localize('back')}</SecondaryButton>
      </div>

      {children}
    </div>
  )
}

export default NotFound
