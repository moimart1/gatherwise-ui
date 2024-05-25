import { createContext, useContext, useEffect, useRef, useState } from 'react'
import SnackBar, { SnackBarSeverity } from '../components/SnackBar'

const SnackBarContext = createContext()

export const useSnackBarContext = () => useContext(SnackBarContext)

export function useSnackBar() {
  return useContext(SnackBarContext)
}

export default function SnackBarProvider({ children }) {
  const timeoutId = useRef()
  const queue = useRef([])
  const [trigQueue, setTrigQueue] = useState(0)
  const [currentSnackBar, setCurrentSnackBar] = useState()

  const snackbarComponent = (severity, message, options = {}) => {
    const key = Math.random() * 10000
    if (!options?.timeout) options.timeout = 5000 // Set 5s by default

    queue.current.push({
      ...options,
      component: <SnackBar key={key} severity={severity} message={message} onClose={() => setCurrentSnackBar(null)} />,
    })

    setTrigQueue(queue.current.length) // Trigger useEffect to show current snackbar
    return key
  }

  useEffect(() => {
    if (!currentSnackBar && queue.current.length > 0) {
      // Show only one snackbar at the time
      const snackbar = queue.current.shift()
      setCurrentSnackBar(snackbar.component)

      timeoutId.current = setTimeout(() => {
        // Setup auto hide
        setCurrentSnackBar(null)
      }, snackbar.timeout)
    }
  }, [trigQueue, currentSnackBar]) // Check only if a new message is added or snackbar is updated (shown, timeout, close)

  useEffect(() => {
    return () => {
      // Clean current timeout if exist
      if (timeoutId.current) clearTimeout(timeoutId.current)
      console.log('[SnackBarProvider] cleaned')
    }
  }, []) // Global unmount

  return (
    <SnackBarContext.Provider
      value={{
        info: (message, options) => snackbarComponent(SnackBarSeverity.Info, message, options),
        success: (message, options) => snackbarComponent(SnackBarSeverity.Success, message, options),
        error: (message, options) => snackbarComponent(SnackBarSeverity.Error, message, options),
      }}
    >
      <div
        className={`fixed bottom-0 right-0 z-100 transition-all duration-300 ${currentSnackBar ? 'opacity-100' : 'opacity-0'}`}
      >
        {currentSnackBar}
      </div>
      {children}
    </SnackBarContext.Provider>
  )
}
