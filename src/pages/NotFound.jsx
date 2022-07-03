import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { localize } from '../libs/localization'

const NotFound = ({ children, lang }) => {
  const location = useLocation()
  return (
    <div className='w-full text-center p-8'>
      <p className='text-xl font-bold text-gray-400'>{localize('not found')(lang)}</p>
      <p>{location.pathname}</p>

      <div className='p-8'>
        <button {...{ onClick: () => {} }}>
          <Link to={'/'}>{localize('return to homepage')(lang)}</Link>
        </button>
      </div>

      {children}
    </div>
  )
}

export default NotFound
