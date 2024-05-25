import { createContext, useContext, useRef, useState } from 'react'

const LoadingContext = createContext()

export const useLoadingContext = () => useContext(LoadingContext)

export function useSetLoading() {
  const { setLoading } = useContext(LoadingContext)
  return setLoading
}

const externContext = { setLoading: undefined }

export default function LoadingProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false)
  const loadingCount = useRef(0)

  const setLoading = (loading) => {
    loading ? loadingCount.current++ : loadingCount.current--
    setIsLoading(loadingCount.current > 0)
  }

  externContext.setLoading = setLoading
  return <LoadingContext.Provider value={{ isLoading, setLoading }}>{children}</LoadingContext.Provider>
}

LoadingProvider.externContext = externContext
