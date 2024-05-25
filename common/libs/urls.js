import { environmentEnum, serviceEnum } from './constants'

export const environment = (() => {
  if (window.location.port) {
    // If url contains `:<something>`, only used on dev
    // If MODE is production then it's local development in docker
    return import.meta.env.MODE === 'production' ? environmentEnum.productionBeta : environmentEnum.development
  }

  if (window.location.origin.includes('beta.gatherwise.com')) {
    // If url contains `<service name>.beta.gatherwise.com`
    return environmentEnum.productionBeta
  }

  return environmentEnum.production // By default
})()

function getOrigin(service, env = environment) {
  return {
    [serviceEnum.admin]: {
      [environmentEnum.production]: 'https://admin.gatherwise.com',
      [environmentEnum.productionBeta]: 'https://admin.beta.gatherwise.com',
      [environmentEnum.development]: 'http://localhost:3002',
    }[env],
    [serviceEnum.cnc]: {
      [environmentEnum.production]: 'https://cnc.gatherwise.com',
      [environmentEnum.productionBeta]: 'https://cnc.beta.gatherwise.com',
      [environmentEnum.development]: 'http://localhost:3004',
    }[env],
    [serviceEnum.edge]: {
      [environmentEnum.production]: 'https://edge.gatherwise.com',
      [environmentEnum.productionBeta]: 'https://edge.beta.gatherwise.com',
      [environmentEnum.development]: 'http://localhost:3003',
    }[env],
    [serviceEnum.webapp]: {
      [environmentEnum.production]: 'https://app.gatherwise.com',
      [environmentEnum.productionBeta]: 'https://app.beta.gatherwise.com',
      [environmentEnum.development]: 'http://localhost:3001',
    }[env],
  }[service]
}

const urlInfo = {
  currentService: serviceEnum.admin,
  origins: Object.values(serviceEnum).reduce((acc, value) => {
    acc[value] = getOrigin(value)
    return acc
  }, {}),
  developmentOrigins: Object.values(serviceEnum).reduce((acc, value) => {
    acc[value] = getOrigin(value)
    return acc
  }, {}),
  backends: Object.values(serviceEnum).reduce((acc, value) => {
    acc[value] = `${getOrigin(value)}/api`
    return acc
  }, {}),
  developmentBackends: Object.values(serviceEnum).reduce((acc, value) => {
    acc[value] = `http://localhost:3000/api`
    return acc
  }, {}),
}

/**
 * Set URL info to run current service / project in DEVELOPMENT mode
 * @param {enum} currentService Service enum name of current project
 * @param {object} origins Set origin url by service. value can be an environment or an url directly
 * @param {object} developmentOrigins Set development origin url by service. value can be an environment or an url directly
 * @param {object} backends Set backend url by service. value can be an environment or an url directly
 * @param {object} developmentBackends Set development backend url by service. value can be an environment or an url directly
 */
export function setUrlInfo(currentService, { origins = {}, developmentOrigins = {}, backends = {}, developmentBackends = {} }) {
  // Current service
  urlInfo.currentService = currentService

  const setUrlByService = (services, pathSuffix = '') => {
    return Object.keys(services).reduce((acc, key) => {
      const envOrUrl = services[key]
      // Manage input as environment if valid
      acc[key] =
        Object.values(environmentEnum).includes(envOrUrl) ?
          getOrigin(key, envOrUrl) + pathSuffix // envOrUrl == environment
        : envOrUrl // envOrUrl == URL
      return acc
    }, {})
  }

  // Origins
  urlInfo.origins = setUrlByService({ ...urlInfo.origins, ...origins })
  // Development origins
  urlInfo.developmentOrigins = setUrlByService({
    ...urlInfo.developmentOrigins,
    ...developmentOrigins,
  })

  // Backends
  urlInfo.backends = setUrlByService({ ...urlInfo.backends, ...backends }, '/api')
  // Development backends
  urlInfo.developmentBackends = setUrlByService({ ...urlInfo.developmentBackends, ...developmentBackends }, '/api')

  console.log('[setUrlInfo]', urlInfo)
}

export function getServiceOrigin(service) {
  service = service ? service : urlInfo.currentService // Current service as default

  if (environment === environmentEnum.development) {
    return urlInfo.developmentOrigins[service]
  }

  return urlInfo.origins[service]
}

export function getBackendUrl(service) {
  service = service ? service : urlInfo.currentService // Current service as default

  if (environment === environmentEnum.development) {
    return urlInfo.developmentBackends[service]
  }

  return urlInfo.backends[service]
}

export function joinPaths(...paths) {
  // join paths with a /, remove double / then remove trailing / (only if not '/')
  return paths
    .join('/')
    .replace(/\/\/+/g, '/')
    .replace(/(.)\/$/, '$1')
}

export function encodeUrlObjectParams(obj) {
  const ENC = {
    '+': '-',
    '/': '_',
    '=': '.',
  }
  const base64 = obj ? window.btoa(JSON.stringify(obj)) : ''
  return base64.replace(/[+/=]/g, (m) => ENC[m])
}

export function decodeUrlObjectParams(value) {
  if (!value) return {}
  return JSON.parse(
    window.atob(
      value.replace(
        /[-_.]/g,
        (m) =>
          ({
            '-': '+',
            _: '/',
            '.': '=',
          })[m]
      )
    )
  )
}

const companyUrlRegex = new RegExp('^/c/([^/]+)') // Start with /c/ and contains something

export function companyPath(companyId) {
  return companyId ? `/c/${companyId}` : ''
}

export function companyFromPath(path) {
  // Extract company ID from path
  const companyId = companyUrlRegex.exec(path)?.[1] // match group 1
  return {
    id: companyId,
    path: companyPath(companyId),
    detected: true,
  }
}

export function companyBasenamePath() {
  const { path } = companyFromPath(window.location.pathname)
  return path
}
