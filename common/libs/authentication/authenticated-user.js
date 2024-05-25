import { jwtDecode } from 'jwt-decode'
import { getCurrentAbility } from '../authorization/casl-ability'
import { dateTime } from '../datetime'

export function tokenToCompany(token) {
  // Used in webapp, integrate in AuthenticatedUser after migration
  return {
    _id: token?.companyId,
    displayName: token?.companyDisplayName,
    slugName: token?.companySlugName,
    subscription: token?.companySubscription,
    subscriptionExpiresAt: token?.companySubscriptionExpiresAt,
  }
}

export class AuthenticatedUser {
  /**
   * Create a new authenticated user
   * @param {Object} params
   * @param {import('oidc-client-ts').UserManager} params.userManager OIDC user manager
   * @param {import('oidc-client-ts').User} params.user OIDC user
   */
  constructor({ userManager, user }) {
    this._userManager = userManager
    this._user = user
    this._accessTokenPayload = undefined
    this._ability = undefined
    this._allowedRoles = undefined
  }

  async logout() {
    await this._userManager?.removeUser()
    await this._userManager?.signoutRedirect({
      id_token_hint: this._user.id_token,
      post_logout_redirect_uri: location.href,
    })
  }

  get decodedToken() {
    if (!this._accessTokenPayload && this.accessToken) {
      this._accessTokenPayload = jwtDecode(this.accessToken)
    }

    return this._accessTokenPayload ?? {}
  }

  get accessToken() {
    return this._user?.access_token
  }

  get decodedIdToken() {
    return this._user.profile ?? {}
  }

  get idToken() {
    return this._user?.id_token
  }

  get isLoggedIn() {
    return this._user?.expires_at > Date.now() / 1000
  }

  get firstName() {
    return this.decodedIdToken?.given_name ?? ''
  }

  get lastName() {
    return this.decodedIdToken?.family_name ?? ''
  }

  get fullName() {
    if (!(this.firstName || this.lastName)) return ''
    return `${this.firstName} ${this.lastName}`
  }

  get username() {
    return this.decodedToken?.preferred_username ?? ''
  }

  get email() {
    return this.decodedIdToken?.email ?? ''
  }

  get companyId() {
    return this.decodedToken?.companyId ?? ''
  }

  get companyDisplayName() {
    return this.decodedIdToken?.companyDisplayName ?? ''
  }

  get companySlugName() {
    return this.decodedIdToken?.companySlugName ?? ''
  }

  get currentCompany() {
    return {
      _id: this?.companyId,
      displayName: this?.companyDisplayName,
      slugName: this?.companySlugName,
      subscription: this?.companySubscription,
      subscriptionExpiresAt: this?.companySubscriptionExpiresAt,
    }
  }

  /**
   * @return {''|'free'|'edge-platform'|'standard'} Subscription
   */
  get companySubscription() {
    return this.decodedToken?.companySubscription ?? ''
  }

  get companySubscriptionExpiresAt() {
    return this.decodedToken?.companySubscriptionExpiresAt ?? '2000-01-01T00:00:00.000Z'
  }

  get isCompanySubscriptionExpired() {
    return dateTime(this.companySubscriptionExpiresAt).isBefore(dateTime())
  }

  get isFromGatherwise() {
    // Used to show debug information, only user from Gatherwise should be authorized
    return String(this.username).endsWith('@gatherwise.com')
  }

  get authClientId() {
    return this.decodedToken?.azp
  }

  async loadAbility({ useCache = true }) {
    if ((useCache && this.ability && this.allowedRoles) || !this.isLoggedIn) {
      // If set and use cache or not access token return cached values, can be undefined
      return { ability: this.ability, allowedRoles: this.allowedRoles }
    }

    const { ability, allowedRoles } = await getCurrentAbility()
    this._ability = ability
    this._allowedRoles = allowedRoles
    return { ability, allowedRoles }
  }

  get ability() {
    return this._ability
  }

  get allowedRoles() {
    return this._allowedRoles
  }

  can(action, subject, field = undefined) {
    if (!this.ability) return false
    return this.ability.can(action, subject, field)
  }

  cannot(action, subject, field = undefined) {
    if (!this.ability) return true
    return this.ability.cannot(action, subject, field)
  }
}
