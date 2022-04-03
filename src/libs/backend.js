import axios from 'axios'
import { useEffect, useState } from 'react'
import User, { useUser } from '../services/user'
import { getBackendUrl } from './urls'

export const Request = async (
  method,
  path,
  { params, body, needAuthenticated = true, service = '' }
) => {
  try {
    const response = await axios(`${getBackendUrl(service)}${path}`, {
      method,
      params,
      data: body,
      headers: {
        Authorization:
          needAuthenticated && User.isLoggedIn()
            ? `Bearer ${User.getToken()}`
            : undefined,
      },
    })

    // Manage different id names (Loopback vs NestJS)
    // Transform 'id' to '_id'
    if (response.data?.id) {
      response.data._id = response.data.id
      delete response.data.id
    } else if (Array.isArray(response.data) && response.data?.[0]?.id) {
      response.data = response.data.map((item) => {
        return { ...item, id: undefined, _id: item.id }
      })
    }
    return response.data
  } catch (err) {
    // Manage special case
    if (err.response?.data?.error?.code === 'VALIDATION_FAILED') {
      const details = (err.response.data.error.details ?? []).map(
        (item) => item?.message
      )
      throw new Error(details.join('\n'))
    } else if (err.response?.data?.error?.code === 'BadRequestException') {
      throw new Error(`${err.response.data.error.message}`)
    }

    throw err
  }
}

/**
 *
 * @param {function} crudFunc
 * @returns {Array} Returns callRequest function, loading, error, ready states and clear function
 */
export const useRequest = (crudFunc, { needAuthenticated = true }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const [ready, setReady] = useState(false)
  const [, isLoggedIn] = useUser()

  const clear = () => {
    // clear state
    setLoading(false)
    setError(undefined)
  }

  useEffect(() => {
    setReady(!needAuthenticated || (needAuthenticated && isLoggedIn))
    return () => {
      setReady(false)
      clear()
    }
  }, [isLoggedIn])

  return [
    async (...args) => {
      let response = undefined
      setError(undefined)
      setLoading(true)

      try {
        if (!ready) {
          setLoading(false)
          return response
        }

        response = await crudFunc(...args)
      } catch (err) {
        setError(err)
      }

      setLoading(false)
      return response
    },
    {
      loading,
      error,
      ready,
    },
    clear,
  ]
}

export const Crud = (basePath, options) => {
  return {
    options,
    create: (data) => {
      return Request('POST', `${basePath}`, { body: data, ...options })
    },
    read: (id) => {
      return Request('GET', `${basePath}/${id}`, options)
    },
    readAll: (params) => {
      return Request('GET', `${basePath}`, { params, ...options })
    },
    update: (id, data) => {
      return Request('PATCH', `${basePath}/${id}`, {
        body: data,
        ...options,
      })
    },
    delete: (id) => {
      return Request('DELETE', `${basePath}/${id}`, options)
    },
  }
}

export const useCrud = (crud) => {
  return {
    useCreate: () => {
      return useRequest(crud.create, crud.options)
    },
    useRead: () => {
      return useRequest(crud.read, crud.options)
    },
    useReadAll: () => {
      return useRequest(crud.readAll, crud.options)
    },
    useUpdate: () => {
      return useRequest(crud.update, crud.options)
    },
    useDelete: () => {
      return useRequest(crud.delete, crud.options)
    },
  }
}
