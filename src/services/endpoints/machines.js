import { getCurrentAccessToken } from '@gatherwise/common-frontend-libs/libs/authentication'
import { createBackendService } from '@gatherwise/common-frontend-libs/libs/backend'
import { serviceEnum } from '@gatherwise/common-frontend-libs/libs/constants'

/**
 * @typedef {Object} OtherWorkstationEndpoints
 * @property {(params: {companyId:string}) => Promise<{total:number, activated:number, billable: number}>} OtherWorkstationEndpoints.count
 * @typedef {import('@gatherwise/common-frontend-libs/libs/backend').Endpoints & OtherWorkstationEndpoints} WorkstationEndpoints
 * @type {import('@gatherwise/common-frontend-libs/libs/backend').CreateBackendServiceResult<WorkstationEndpoints>}
 */
export const [getMachineService, useMachineService] = createBackendService(
  { basePath: '/workstations', service: serviceEnum.admin, getAccessToken: getCurrentAccessToken },
  ({ endpoints, backendClient, basePath }) => {
    return {
      ...endpoints,
      count: async (params) => {
        return await backendClient.get(`${basePath}/count`, { params })
      },
    }
  }
)
