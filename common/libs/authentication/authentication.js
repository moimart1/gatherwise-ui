import { Mutex } from 'async-mutex'
import { UserManager } from 'oidc-client-ts'
import { AuthenticatedUser } from './authenticated-user'
export class AuthService {
  constructor({ authority, client_id, useBackendAbility, userCallback }) {
    this._useBackendAbility = useBackendAbility
    this._userCallback = userCallback
    this.userManager = new UserManager({
      authority,
      client_id,
      response_type: 'code',
      scope: 'openid',
      response_mode: 'query',
      silent_redirect_uri: `${location.origin}/silent-renew.html`,
      automaticSilentRenew: true,
      filterProtocolClaims: false,
      monitorSession: false,
    })

    this._mutex = new Mutex() // Avoid multiple run of authentication
    this._setupEvents(true)
    this._authenticatedUser = undefined
  }

  _setupEvents(add = true) {
    this.userManager.events[`${add ? 'add' : 'remove'}SilentRenewError`](this.onSilentRenewError.bind(this))
    this.userManager.events[`${add ? 'add' : 'remove'}UserLoaded`](this.onUser.bind(this))
    //this.userManager.events[`${add ? 'add' : 'remove'}AccessTokenExpiring`](onAccessTokenExpiring)
  }

  _isLoginCallback(url) {
    const redirect_uri = new URL(url)
    return (
      redirect_uri.searchParams.get('iss') === this.userManager?.settings?.authority &&
      !!redirect_uri.searchParams.get('code') &&
      !!redirect_uri.searchParams.get('state')
    )
  }

  _cleanLoginUrl(url) {
    const urlObj = new URL(url)
    for (const unwanted of ['iss', 'state', 'session_state', 'code']) {
      urlObj.searchParams.delete(unwanted)
    }

    return urlObj.toString()
  }

  onSilentRenewError(err) {
    console.log('[onSilentRenewError]', err?.message)
    if (err?.message !== 'login_required') {
      // On error that is not login_required, try to silent sign-in
      // Probably because multiple tabs are opened
      // NOTE: Silent login doesn't work with localhost, need to have sso and app on the same domain (e.g. gatherwise.com)
      console.log('[AuthenticationContainer] try to silent sign-in')
      this.userManager.removeUser().then(() => {
        // revoke refresh token to force silent sign-in
        this.userManager.signinSilent().catch(this.onSilentRenewError.bind(this))
      })
    } else {
      this.login()
    }
  }

  /**
   * Callback on user loaded
   * @param {import('oidc-client-ts').User} user OIDC User
   * @returns Authenticated user
   */
  async onUser(user) {
    console.log(`[AuthService] onUser: expire at ${new Date((user?.expires_at ?? 0) * 1000).toLocaleString()}`)
    if (this._authenticatedUser?.accessToken === user?.access_token) {
      return this._authenticatedUser // Already setup
    }

    this._authenticatedUser = new AuthenticatedUser({ userManager: this.userManager, user })
    if (this._useBackendAbility) {
      await this._authenticatedUser.loadAbility({ useCache: true })
    }

    if (typeof this._userCallback === 'function') {
      await this._userCallback(this._authenticatedUser)
    }

    return this._authenticatedUser
  }

  async clean() {
    await this.userManager.events.unload()
    this._setupEvents(false)
    this.userManager.stopSilentRenew()
    console.log(`[AuthService] cleaned ${this.userManager.settings.authority}`)
    this.userManager = undefined
  }

  async login(redirect_uri = '') {
    redirect_uri = this._cleanLoginUrl(redirect_uri ? redirect_uri : window.location.href)
    console.log(`[AuthService] login with redirect_uri ${redirect_uri}`)
    await this.userManager?.signinRedirect({ redirect_uri })
  }

  /**
   * Finalize authentication code flow
   * @returns {Promise<AuthenticatedUser>} The authenticated user
   */
  async loginFinalize() {
    console.log('[AuthService] finalizing login...')
    const user = await this.userManager?.signinRedirectCallback().catch((err) => {
      console.error(`Unable to finalize login: ${err.message}`)
      this.userManager.clearStaleState()
      throw err // Abort login
    })

    // Remove auth query parameters from url
    window.history.replaceState(
      {},
      document.title,
      // Clean current url and remove the origin
      this._cleanLoginUrl(window.location.href).substring(window.location.origin.length)
    )
    return await this.onUser(user)
  }

  /**
   * Get current authenticated user, can be null
   * @returns {Promise<AuthenticatedUser|null>}
   */
  async getUser() {
    if (!this._authenticatedUser || !this._authenticatedUser.isLoggedIn) {
      const user = await this.userManager?.getUser() // Get user in store
      await this.onUser(user)
    }

    return this._authenticatedUser
  }

  async getAuthenticatedUser({ request }) {
    return await this._mutex.runExclusive(async () => {
      let user = await this.getUser()
      if (!user?.isLoggedIn) {
        console.log('[AuthService] starting authentication...')
        if (this._isLoginCallback(request.url)) {
          user = await this.loginFinalize().catch(() => {
            // Reload to root
            window.location.href = '/'
          })
        } else {
          // Will reload the page
          return await this.login(request.url)
        }
      }

      return user
    })
  }
}

export class AuthModule {
  static _current = { companyId: '', clientId: '', backendAbility: true, userCallback: undefined, changed: false }
  /**
   * @type {AuthService} Instance of Auth service
   */
  static _instance = null
  static _mutex = new Mutex()

  /**
   * Set client ID
   * @param {string} clientId
   * @returns {AuthModule}
   */
  static setClientId(clientId) {
    if (clientId !== this._current.clientId) {
      this._current.clientId = clientId
      this._current.changed = true
    }

    return this
  }

  /**
   * Set company ID
   * @param {string} companyId
   */
  static setCompanyId(companyId) {
    if (companyId !== this._current.companyId) {
      this._current.companyId = companyId
      this._current.changed = true
    }

    return this
  }

  /**
   * If true will load backend ability
   * @param {boolean} backendAbility
   * @returns {AuthModule}
   */
  static useBackendAbility(backendAbility) {
    if (backendAbility !== this._current.backendAbility) {
      this._current.backendAbility = backendAbility
      this._current.changed = true
    }

    return this
  }

  /**
   * Set the authenticated user callback
   * @param {function(AuthenticatedUser)} userCallback
   * @returns {AuthModule}
   */
  static setUserCallback(userCallback) {
    if (userCallback !== this._current.userCallback) {
      this._current.userCallback = userCallback
      this._current.changed = true
    }

    return this
  }

  /**
   * Get true if Auth is initialized
   * @returns {boolean}
   */
  static get isInitialized() {
    return !!this._instance && !!this._instance.userManager
  }

  /**
   * Get authentication service
   * @returns {Promise<AuthService>}
   */
  static async getService() {
    // Use mutex to avoid to have multiple run of authentication
    return await this._mutex.runExclusive(async () => {
      if (!this.isInitialized || this._current.changed) {
        this._current.changed = false
        console.log(
          `[AuthModule] Set auth service for company ${this._current.companyId}, ` +
            `client ${this._current.clientId}, ` +
            `use backend ability ${this._current.backendAbility} and have a user callback ${!!this._current.userCallback}`
        )
        if (this._instance?.clean) await this._instance.clean()
        this._instance = new AuthService({
          authority: `https://sso.gatherwise.com/realms/webapp${this._current.companyId ? `-${this._current.companyId}` : ''}`,
          client_id: this._current.clientId,
          useBackendAbility: this._current.backendAbility,
          userCallback: this._current.userCallback,
        })
      }

      return this._instance
    })
  }
}

/**
 * Callback for adding two numbers.
 *
 * @callback withAuthenticatedUserLoaderCb
 * @param {} callback - A callback.
 */

/**
 * Set the company if available, authenticate the user if needed then pass it to args
 * @typedef {function(import('react-router-dom').LoaderFunctionArgs<Context> & { authenticatedUser: AuthenticatedUser})} withUser
 * @param {withUser} callback - A callback that run the loader with user.
 */
export const withAuthenticatedUserLoader =
  (callback) =>
  async ({ request, params, ...args }) => {
    const authService = await AuthModule.setCompanyId(params.companyId).getService()
    const authenticatedUser = await authService.getAuthenticatedUser({ request })
    return await callback({ request, params, ...args, authenticatedUser })
  }

export async function getCurrentAccessToken() {
  const authService = await AuthModule.getService()
  const user = await authService.getUser()
  if (user) return user.accessToken
  return ''
}
