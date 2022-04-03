import { environmentEnum } from './constants'

export const environment = (() => {
  if (window.location.port) {
    // If url contains `:<something>`, only used on dev
    return environmentEnum.development
  }

  return environmentEnum.production // By default
})()

export function getBackendUrl() {
  return 'http://localhost:3000/api'
}

export function joinPaths(...paths) {
  // join paths with a /, remove double / then remove trailing / (only if not '/')
  return paths
    .join('/')
    .replace(/\/\/+/g, '/')
    .replace(/(.)\/$/, '$1')
}
