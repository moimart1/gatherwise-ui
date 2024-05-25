import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { components } from 'react-select'
import { faSquareCheck } from '@fortawesome/pro-solid-svg-icons'
import { faSquare } from '@fortawesome/pro-regular-svg-icons'

const Option = ({ children, ...props }) => {
  return (
    <components.Option {...props}>
      <div className='pl-4'>
        <span className={`mx-1`}>
          <FontAwesomeIcon className='mx-1' icon={props.isSelected ? faSquareCheck : faSquare} />
        </span>

        {children}
      </div>
    </components.Option>
  )
}

export default Option
