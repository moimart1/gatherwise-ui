import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import LinkPlus from './LinkPlus'

export default function DockIcon({ name, link, icon, iconProps }) {
  return (
    <div className=''>
      <LinkPlus key={name} to={link} className='grid place-items-center'>
        <div className='shadow-md border border-gray-300 rounded h-16 w-16 grid place-items-center'>
          <FontAwesomeIcon icon={icon} {...iconProps} />
        </div>
        <span>{name}</span>
      </LinkPlus>
    </div>
  )
}
