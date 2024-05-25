import { createContext, useContext, useEffect, useState } from 'react'
import { AuthModule, AuthenticatedUser } from '../libs/authentication'

const AuthenticatedUserContext = createContext({ authenticatedUser: {} })

/**
 * Get the current authenticated user
 * @returns {AuthenticatedUser} Authenticated user
 */
export function useAuthenticatedUser() {
  const { authenticatedUser } = useContext(AuthenticatedUserContext)
  return authenticatedUser
}

export default function AuthenticatedUserProvider({ children }) {
  const [authenticatedUser, setAuthenticatedUser] = useState()

  useEffect(() => {
    AuthModule.setUserCallback(async (authenticatedUser) => {
      console.log('[AuthenticatedUserProvider] onUserCallback')
      setAuthenticatedUser(authenticatedUser)
    })

    console.log('[AuthenticatedUserProvider] User initialized')
    return () => {
      console.log('[AuthenticatedUserProvider] cleaning')
      AuthModule.setUserCallback(undefined)
    }
  }, [])

  console.log(`[AuthenticatedUserProvider] instanced, auth module ready: ${AuthModule.isInitialized}`)
  return <AuthenticatedUserContext.Provider value={{ authenticatedUser }}>{children}</AuthenticatedUserContext.Provider>
}
