import { useCrudBackend } from '../../libs/backend'

const basePath = '/synchronizations'

export function useSynchronizationService() {
  const { backendRequest, endpoints } = useCrudBackend(basePath)
  return {
    ...endpoints,
    getContext: async () => {
      return await backendRequest.current.get(`${basePath}/context`)
    },
    syncToSplitwise: async (data) => {
      return await backendRequest.current.post(`${basePath}/splitwise`, data)
    },
  }
}
