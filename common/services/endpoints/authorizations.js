import { getCurrentAccessToken } from '../../libs/authentication'
import { createBackendService } from '../../libs/backend'

/**
 * @typedef {Object} AuthorizationEndpoints
 * @property {() => Promise<object>} AuthorizationEndpoints.getRules
 * @property {() => Promise<object>} AuthorizationEndpoints.getAllowedRoles
 * @typedef {AuthorizationEndpoints} AuthorizationEndpoints
 * @type {import('../../libs/backend').CreateBackendServiceResult<AuthorizationEndpoints>}
 */
export const [getAuthorizationService, useAuthorizationService] = createBackendService(
  { basePath: '/authorizations', service: '' /* current */, getAccessToken: getCurrentAccessToken },
  ({ backendClient, basePath }) => {
    return {
      getRules: async () => {
        return await backendClient.get(`${basePath}/rules`)
      },
      getAllowedRoles: async () => {
        return await backendClient.get(`${basePath}/roles`)
      },
    }
  }
)
