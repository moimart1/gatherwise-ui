import { getCurrentAccessToken } from '@gatherwise/common-frontend-libs/libs/authentication'
import { createBackendService } from '@gatherwise/common-frontend-libs/libs/backend'
import { serviceEnum } from '@gatherwise/common-frontend-libs/libs/constants'

/**
 * @typedef {Object} OtherUserLinksEndpoints
 * @property {(params: object) => Promise<object>} OtherUserLinksEndpoints.upgradeInfrastructure
 * @typedef {import('@gatherwise/common-frontend-libs/libs/backend').Endpoints & OtherUserLinksEndpoints} UserLinkEndpoints
 * @type {import('@gatherwise/common-frontend-libs/libs/backend').CreateBackendServiceResult<UserLinkEndpoints>}
 */
export const [getUserLinkService, useUserLinkService] = createBackendService(
  { basePath: '/user-links', service: serviceEnum.admin, getAccessToken: getCurrentAccessToken },
  ({ endpoints, backendClient, basePath }) => {
    return {
      ...endpoints,
      upgradeInfrastructure: async (params) => {
        return await backendClient.patch(`${basePath}`, {}, { params })
      },
    }
  }
)
