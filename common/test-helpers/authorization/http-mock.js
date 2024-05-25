import { packRules } from '@casl/ability/extra'
import { roleEnum } from '../../libs/authorization'

export function mockRules(mockRequest, ability) {
  mockRequest.onGet(new RegExp('.*/api/authorizations/rules')).reply(200, packRules(ability?.rules ?? []))
}

export function mockRoles(mockRequest, roles = Object.values(roleEnum)) {
  mockRequest.onGet(new RegExp('.*/api/authorizations/roles.*')).reply(200, roles)
}
