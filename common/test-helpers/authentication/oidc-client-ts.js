import * as exports from 'oidc-client-ts'
import { vi } from 'vitest'

vi.spyOn(exports.UserManager.prototype, 'getUser').mockImplementation(async () => {
  return { expires_at: new Date().getTime() + 30 * 1000, access_token: 'testAccessToken==' }
})

export const UserManager = exports.UserManager
