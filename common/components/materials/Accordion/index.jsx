import React from 'react'

// utils

// context
import { AccordionContextProvider, useAccordion } from './AccordionContext'

// accordion components
import { classNames } from '../../../libs/style'
import { AccordionBody } from './AccordionBody'
import { AccordionHeader } from './AccordionHeader'
import { propTypesAnimate, propTypesChildren, propTypesClassName, propTypesDisabled, propTypesIcon, propTypesOpen } from './type'

const Accordion = React.forwardRef(({ open, icon, animate, className, disabled, children, ...rest }, ref) => {
  const contextValue = React.useMemo(() => ({ open, icon, animate, disabled }), [open, icon, animate, disabled])

  return (
    <AccordionContextProvider value={contextValue}>
      <div
        {...rest}
        ref={ref}
        className={classNames(className, 'relative block w-full', disabled && 'pointer-events-none opacity-50')}
      >
        {children}
      </div>
    </AccordionContextProvider>
  )
})

Accordion.propTypes = {
  open: propTypesOpen,
  icon: propTypesIcon,
  animate: propTypesAnimate,
  disabled: propTypesDisabled,
  className: propTypesClassName,
  children: propTypesChildren,
}

Accordion.displayName = 'MaterialTailwind.Accordion'

export { Accordion, AccordionBody, AccordionHeader, useAccordion }

export default Object.assign(Accordion, {
  Header: AccordionHeader,
  Body: AccordionBody,
})
