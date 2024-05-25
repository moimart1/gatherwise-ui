import axios from 'axios'
import { useEffect, useState } from 'react'
import { useAuthenticatedUser } from '../providers/AuthenticatedUserProvider'
import LoadingProvider from '../providers/LoadingProvider'
import { getBackendUrl } from './urls'

export class BackendException extends Error {
  constructor({ message, code, status, endpoints } = {}) {
    super(message)
    this.code = code ?? ''
    this.status = status ?? 0
    this.endpoints = endpoints ?? ''
  }
}

const createBackendClient = ({ baseUrl, getAccessToken, onLoading }) => {
  const client = axios.create({ baseURL: baseUrl })

  client.interceptors.request.use(
    async (config) => {
      let accessToken = undefined
      if (typeof onLoading === 'function') onLoading(true)
      if (typeof getAccessToken === 'function') accessToken = await getAccessToken()
      config.headers.Authorization = accessToken ? `Bearer ${accessToken}` : undefined
      return config
    },
    (error) => {
      if (typeof onLoading === 'function') onLoading(false)
      return Promise.reject(error)
    }
  )

  client.interceptors.response.use(
    (response) => {
      if (typeof onLoading === 'function') onLoading(false)
      return response.data
    },
    (error) => {
      const backendException = new BackendException(error)
      if (typeof onLoading === 'function') onLoading(false)
      if (error?.response?.status) {
        backendException.status = error.response.status
      }

      if (error?.request?.responseURL) {
        const url = new URL(error.request.responseURL)
        backendException.endpoints = url.toString().replace(url.origin, '')
      } else if (error?.config?.url) {
        backendException.endpoints = error.config.url
      }

      if (error?.response?.data) {
        const response = error.response.data
        // Update code and message with response data
        backendException.code = response?.error?.code ? response.error.code : backendException.code
        backendException.message = response?.error?.message ? response.error.message : backendException.message
      }

      return Promise.reject(backendException)
    }
  )

  return client
}

/**
 * @typedef {Object} Endpoints
 * @property {(data: object) => Promise<object>} Endpoints.create
 * @property {(id: string, params: object) => Promise<object>} Endpoints.read
 * @property {(params: object) => Promise<object>} Endpoints.readAll
 * @property {(id: string, data: object, params: object) => Promise<object>} Endpoints.update
 * @property {(id: string, params: object) => Promise<object>} Endpoints.delete
 */

/**
 * Get CRUD endpoints
 * @param {{backendClient: import('axios').AxiosInstance, basePath: string}} options
 * @returns {{endpoints: Endpoints, backendClient: import('axios').AxiosInstance, basePath:string}}
 */
export function getCrud({ backendClient, basePath }) {
  return {
    backendClient,
    basePath,
    endpoints: {
      create: async (data) => {
        return await backendClient.post(basePath, data)
      },
      read: async (id, params = {}) => {
        return await backendClient.get(`${basePath}/${id}`, { params })
      },
      readAll: async (params = {}) => {
        return await backendClient.get(`${basePath}`, { params })
      },
      update: async (id, data, params = {}) => {
        return await backendClient.patch(`${basePath}/${id}`, data, { params })
      },
      delete: async (id, params = {}) => {
        return await backendClient.delete(`${basePath}/${id}`, { params })
      },
    },
  }
}

const backendServices = {}
const onLoading = (loading) => {
  if (typeof LoadingProvider.externContext.setLoading == 'function') {
    LoadingProvider.externContext.setLoading(loading)
  }
}

/**
 * @typedef {Object} HookResult
 * @property {boolean} HookResult.isReady True when the user is authenticated if the endpoint needs an access token
 * @property {boolean} HookResult.loading True when waiting for the response of a backend call
 * @property {Error} HookResult.error Contains an error if backend call is failed
 */

/**
 * @template T
 * @typedef {[function():T, function():(T & HookResult)]} CreateBackendServiceResult
 */

/**
 * @param {{basePath:string, service:string, getAccessToken:function}} options
 * @param {function(ReturnType<getCrud>)} additionalEndpoints
 * @returns {CreateBackendServiceResult<Endpoints>}
 */
export function createBackendService({ basePath, service, getAccessToken = undefined }, additionalEndpoints) {
  const getBackendClient = () => {
    const baseUrl = getBackendUrl(service)
    const key = `${baseUrl}+${!!getAccessToken}`
    if (!backendServices[key]) {
      backendServices[key] = createBackendClient({ baseUrl, getAccessToken, onLoading })
    }

    return backendServices[key]
  }

  return [
    () => {
      // getBackendService
      return additionalEndpoints(getCrud({ basePath, backendClient: getBackendClient() }))
    },
    () => {
      // useBackendService
      const authenticatedUser = useAuthenticatedUser()
      const [isReady, setReady] = useState(false)
      const [loading, setLoading] = useState(false)
      const [error, setError] = useState()

      useEffect(() => {
        const ready = (typeof getAccessToken === 'function' && authenticatedUser?.isLoggedIn === true) || !getAccessToken
        setReady(ready)
      }, [authenticatedUser])

      const wrappedEndpoints = Object.entries(
        additionalEndpoints(getCrud({ basePath, backendClient: getBackendClient() }))
      ).reduce((acc, [name, fn]) => {
        if (typeof fn === 'function') {
          const wrap = async (...params) => {
            try {
              setLoading(true)
              setError(undefined)
              return await fn.call(this, ...params)
            } catch (err) {
              setError(err)
              throw err
            } finally {
              setLoading(false)
            }
          }

          acc[name] = wrap
          return acc
        }

        // Keep non 'function' typed values
        acc[name] = fn
        return acc
      }, {})

      return { ...wrappedEndpoints, loading, error, isReady }
    },
  ]
}
