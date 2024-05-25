import { jwtDecode as original } from 'jwt-decode'
import { vi } from 'vitest'

const exports = { jwtDecode: original }
const userContext = {
  preferred_username: 'super.admin@gatherwise.test',
  given_name: 'Admin',
  companyId: 'dgczkqtc7jh2crpa',
  name: 'Admin Test',
  companySubscriptionExpiresAt: '2100-01-01T00:00:00.000Z',
  companySubscription: 'standard',
  companySlugName: 'test-company',
  family_name: 'Test',
  email: 'super.admin@gatherwise.test',
  companyDisplayName: 'Test company',
}

vi.spyOn(exports, 'jwtDecode').mockImplementation(() => {
  const ts = Math.trunc(new Date().getTime())
  return {
    exp: ts + 300,
    iat: ts,
    auth_time: ts,
    jti: 'c7e9df9d-8934-448d-854b-3c0f62c01053',
    iss: 'https://sso.gatherwise.com/realms/webapp-test-realm',
    aud: 'admin-frontend',
    sub: 'caca4f72-2c06-4bd1-acf8-7552e8c78459',
    typ: 'Bearer',
    azp: 'admin-frontend',
    nonce: '55bde653-3dc2-474e-82de-1dbc831eb5d1',
    session_state: '92ca8c4a-09d5-423f-b43b-27189c4892c5',
    scope: 'openid email profile',
    sid: '92ca8c4a-09d5-423f-b43b-27189c4892c5',
    email_verified: true,
    roles: ['allowed-in-this-realm', 'app-admin'],
    publicKey: 'AhucsQWLLlaK776LFRfaa-crwpBXVHe6t3ZdlgQoH84T',
    globalUserId: '2b411575-f939-4892-9101-e01c5c98b0a6',
    ...userContext,
  }
})

export const jwtDecode = exports.jwtDecode

export function updateTestUserProfile(user = userContext) {
  Object.assign(userContext, user)
}
