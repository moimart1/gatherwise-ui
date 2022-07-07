import { useCrudBackend } from '../../libs/backend'

const basePath = '/transactions'

export function useTransactionService() {
  const { endpoints } = useCrudBackend(basePath)
  return {
    ...endpoints,
  }
}
