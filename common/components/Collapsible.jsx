import { faChevronDown, faChevronRight } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'

export default function Collapsible({ className, open, children, title }) {
  const [isOpen, setIsOpen] = useState(open)

  const handleFilterOpening = () => {
    setIsOpen((prev) => !prev)
  }

  return (
    <div className={className}>
      <div>
        <div className='flex flex-row space-x-2 p-2'>
          <button type='button' className='btn' onClick={handleFilterOpening}>
            {isOpen ?
              <FontAwesomeIcon icon={faChevronDown} />
            : <FontAwesomeIcon icon={faChevronRight} />}
          </button>
          <h6 className='font-normal'>{title}</h6>
        </div>
      </div>

      <div className=''>
        <div>{isOpen && <div className=''>{children}</div>}</div>
      </div>
    </div>
  )
}
