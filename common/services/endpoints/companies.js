import { getCurrentAccessToken } from '../../libs/authentication'
import { createBackendService } from '../../libs/backend'
import { serviceEnum } from '../../libs/constants'

/**
 * @typedef {Object} QueryCompanies
 * @property {boolean} QueryCompanies.includeJoinable
 * @property {string[]} QueryCompanies.fields
 */

/**
 * @typedef {Object} OtherCompanyEndpoints
 * @property {(params: QueryCompanies) => Promise<object>} OtherCompanyEndpoints.readAll // TODO Override not working
 * @property {(params: object) => Promise<object>} OtherCompanyEndpoints.upgradeInfrastructure
 * @property {(params: object) => Promise<object>} OtherCompanyEndpoints.upgradeGlobalInfrastructure
 * @property {(id: string, data: object) => Promise<object>} OtherCompanyEndpoints.updateQuota
 * @typedef {import('../../libs/backend').Endpoints & OtherCompanyEndpoints} CompanyEndpoints
 * @type {import('../../libs/backend').CreateBackendServiceResult<CompanyEndpoints>}
 */
export const [getCompanyService, useCompanyService] = createBackendService(
  { basePath: '/companies', service: serviceEnum.admin, getAccessToken: getCurrentAccessToken },
  ({ endpoints, backendClient, basePath }) => {
    return {
      ...endpoints,
      upgradeInfrastructure: async (params) => {
        return await backendClient.patch(`${basePath}`, {}, { params })
      },
      upgradeGlobalInfrastructure: async (params) => {
        return await backendClient.patch(`${basePath}/global`, {}, { params })
      },
      updateQuota: async (id, data) => {
        return await backendClient.patch(`${basePath}/${id}/quota`, data)
      },
    }
  }
)
