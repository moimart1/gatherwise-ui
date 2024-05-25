import React from 'react'
import { propTypesChildren, propTypesValue } from './type'

export const AccordionContext = React.createContext({ open: false })
AccordionContext.displayName = 'MaterialTailwind.AccordionContext'

export function useAccordion() {
  const context = React.useContext(AccordionContext)

  if (!context) {
    throw new Error(
      'useAccordion() must be used within an Accordion. It happens when you use AccordionHeader or AccordionBody components outside the Accordion component.'
    )
  }

  return context
}

export const AccordionContextProvider = ({ value, children }) => {
  return <AccordionContext.Provider value={value}>{children}</AccordionContext.Provider>
}

AccordionContextProvider.propTypes = {
  value: propTypesValue,
  children: propTypesChildren,
}

AccordionContextProvider.displayName = 'MaterialTailwind.AccordionContextProvider'
