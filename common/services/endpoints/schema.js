import { getCurrentAccessToken } from '../../libs/authentication'
import { createBackendService } from '../../libs/backend'

/**
 * @typedef {Object} SchemaEndpoints
 * @property {() => Promise<object>} OtherCompanyEndpoints.get
 * @typedef {SchemaEndpoints} SchemaEndpoints
 * @type {import('../../libs/backend').CreateBackendServiceResult<SchemaEndpoints>}
 */
export const [getSchemaService, useSchemaService] = createBackendService(
  { basePath: '/schema', service: '' /* current */, getAccessToken: getCurrentAccessToken },
  ({ backendClient, basePath }) => {
    return {
      get: async () => {
        return await backendClient.get(`${basePath}`)
      },
    }
  }
)
