import React from 'react'

// context
import { useAccordion } from './AccordionContext'
import { propTypesChildren, propTypesClassName } from './type'
// TODO refactor more clean
export const AccordionBody = React.forwardRef(({ className, children }, ref) => {
  const { open } = useAccordion()

  return (
    <div className={className}>
      <div
        className={`overflow-hidden px-1 pt-0 transition-[max-height] duration-200 ease-in md:px-6 ${
          open ? 'max-h-screen' : 'max-h-0'
        }`}
      >
        {children}
      </div>
    </div>
  )
})

AccordionBody.propTypes = {
  className: propTypesClassName,
  children: propTypesChildren,
}

AccordionBody.displayName = 'MaterialTailwind.AccordionBody'

export default AccordionBody
