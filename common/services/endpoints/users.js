import { getCurrentAccessToken } from '../../libs/authentication'
import { createBackendService } from '../../libs/backend'
import { serviceEnum } from '../../libs/constants'

/**
 * @typedef {Object} OtherUserEndpoints
 * @property {(params: {companyId:string}) => Promise<{total:number}>} OtherUserEndpoints.count
 * @property {(username: string) => Promise<object>} OtherUserEndpoints.resetPassword
 * @typedef {import('../../libs/backend').Endpoints & OtherUserEndpoints} UserEndpoints
 * @type {import('../../libs/backend').CreateBackendServiceResult<UserEndpoints>}
 */
export const [getUserService, useUserService] = createBackendService(
  { basePath: '/users', service: serviceEnum.admin, getAccessToken: getCurrentAccessToken },
  ({ endpoints, backendClient, basePath }) => {
    return {
      ...endpoints,
      count: async (params) => {
        return await backendClient.get(`${basePath}/count`, { params })
      },
      resetPassword: async (username) => {
        return await backendClient.put(`${basePath}/${username}/reset-password`)
      },
    }
  }
)
