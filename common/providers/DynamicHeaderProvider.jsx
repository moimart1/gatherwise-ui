import { createContext, useContext, useEffect, useState } from 'react'

export const DynamicHeaderContext = createContext()

/**
 *
 * @param {Object} options
 * @param {string} options.placeholder Text to show when nothing else to show
 * @param {(() => JSX.Element)[]} options.actionComponents List of components
 * @param {import('../components/NavBar').MenuItemMap[]} options.menuMap Sub menu
 * @returns
 */
export function useDynamicHeader({ placeholder = '', menuMap = [], actionComponents = [] } = {}) {
  const { setPlaceholder, setMenuMap, setActionComponents } = useContext(DynamicHeaderContext)

  useEffect(() => {
    if (placeholder) setPlaceholder(placeholder)
    setMenuMap(() => menuMap)
    setActionComponents(() => actionComponents)
    return () => {
      setPlaceholder('')
      setMenuMap([])
      setActionComponents([])
    }
  }, [placeholder])

  const reloadActionComponents = () => {
    // Force new state
    setActionComponents((previous) => [...previous])
  }

  return { placeholder, setPlaceholder, reloadActionComponents }
}

export default function DynamicHeaderProvider({ children }) {
  const [placeholder, setPlaceholder] = useState('')
  const [menuMap, setMenuMap] = useState([])
  const [actionComponents, setActionComponents] = useState([])

  return (
    <DynamicHeaderContext.Provider
      value={{ placeholder, setPlaceholder, menuMap, setMenuMap, actionComponents, setActionComponents }}
    >
      {children}
    </DynamicHeaderContext.Provider>
  )
}
