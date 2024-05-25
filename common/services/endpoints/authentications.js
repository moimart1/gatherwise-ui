import { getCurrentAccessToken } from '../../libs/authentication'
import { createBackendService } from '../../libs/backend'
import { serviceEnum } from '../../libs/constants'

/**
 * @typedef {Object} AuthenticationEndpoints
 * @property {() => Promise<object>} AuthenticationEndpoints.createBrokerToken
 * @typedef {AuthenticationEndpoints} AuthenticationEndpoints
 * @type {import('../../libs/backend').CreateBackendServiceResult<AuthenticationEndpoints>}
 */
export const [getAuthenticationService, useAuthenticationService] = createBackendService(
  { basePath: '/authentications', service: serviceEnum.admin, getAccessToken: getCurrentAccessToken },
  ({ backendClient, basePath }) => {
    return {
      createBrokerToken: async () => {
        return await backendClient.post(`${basePath}/broker/token`)
      },
    }
  }
)
