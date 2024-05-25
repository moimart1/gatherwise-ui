import { useEffect } from 'react'
import AuthenticatedUserProvider from '../providers/AuthenticatedUserProvider'
import BrokerProvider from '../providers/BrokerProvider'
import DynamicHeaderProvider from '../providers/DynamicHeaderProvider'
import LanguageProvider from '../providers/LanguageProvider'
import LoadingProvider from '../providers/LoadingProvider'
import SnackBarProvider from '../providers/SnackBarProvider'
import { GlobalStoreProvider } from '../stores/globals'
import CurrentPage from './CurrentPage'

export function ApplicationContextProvider({ router, storeHooks, useBroker }) {
  useEffect(() => {
    console.log('[ApplicationContextProvider] initialized')
    return () => {
      console.log('[ApplicationContextProvider] cleaned')
    }
  }, []) // Global unmount

  console.log('[ApplicationContextProvider] loaded')
  return (
    <AuthenticatedUserProvider>
      <LoadingProvider>
        <SnackBarProvider>
          <LanguageProvider>
            <BrokerProvider enabled={useBroker}>
              <GlobalStoreProvider storeHooks={storeHooks}>
                <DynamicHeaderProvider>
                  <CurrentPage router={router} />
                </DynamicHeaderProvider>
              </GlobalStoreProvider>
            </BrokerProvider>
          </LanguageProvider>
        </SnackBarProvider>
      </LoadingProvider>
    </AuthenticatedUserProvider>
  )
}
