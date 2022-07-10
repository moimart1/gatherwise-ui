import { useCrudBackend } from '../../libs/backend'

const basePath = '/import'

export function useImportService() {
  const { backendRequest, endpoints } = useCrudBackend(basePath)
  return {
    ...endpoints,
    uploadFile: async (formData) => {
      return await backendRequest.current.post(`${basePath}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    },
    convertToTransactions: async (id) => {
      return await backendRequest.current.put(`${basePath}/${id}/convert`, {})
    },
  }
}
