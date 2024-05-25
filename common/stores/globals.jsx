import React, { createContext, useContext } from 'react'

const globalStoreContext = createContext({})

export const useGlobalStore = () => useContext(globalStoreContext)

export const GlobalStoreProvider = ({ storeHooks, children }) => {
  const stores = Object.entries(storeHooks ?? {}).reduce((acc, [key, hook]) => {
    acc[key] = hook() // Initialize hook
    return acc
  }, {})
  return <globalStoreContext.Provider value={{ ...(stores ?? {}) }}>{children}</globalStoreContext.Provider>
}
