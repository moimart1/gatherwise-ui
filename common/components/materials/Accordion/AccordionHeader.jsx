import React from 'react'

// utils

// context
import { classNames } from '../../../libs/style'
import { useAccordion } from './AccordionContext'
import { propTypesChildren, propTypesClassName } from './type'

export const AccordionHeader = React.forwardRef(({ className, children, ...rest }, ref) => {
  const { open, icon, disabled } = useAccordion()

  return (
    <button
      {...rest}
      ref={ref}
      type='button'
      disabled={disabled}
      className={classNames(
        className,
        'border-b-blue-gray-100 flex w-full items-center justify-between border-b py-4',
        'text-blue-gray-700 hover:text-blue-gray-900 select-none  text-left font-sans leading-snug antialiased transition-colors',
        open && 'text-blue-gray-900'
      )}
    >
      {children}
      <span className={'ml-4'}>
        {icon ??
          (open ?
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'>
              <path fillRule='evenodd' d='M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z' clipRule='evenodd' />
            </svg>
          : <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'>
              <path
                fillRule='evenodd'
                d='M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z'
                clipRule='evenodd'
              />
            </svg>)}
      </span>
    </button>
  )
})

AccordionHeader.propTypes = {
  className: propTypesClassName,
  children: propTypesChildren,
}

AccordionHeader.displayName = 'MaterialTailwind.AccordionHeader'

export default AccordionHeader
