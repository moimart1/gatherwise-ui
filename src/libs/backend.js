import axios from 'axios'
import { useEffect, useRef } from 'react'

export const useBackendRequest = () => {
  const axiosInstance = useRef()
  const baseUrl = 'http://localhost:3000/api' // TODO magic string
  const isReady = true

  useEffect(() => {
    if (!isReady) return // Authenticated request required for backend
    console.log('[useBackendRequest] instantiated')
    axiosInstance.current = axios.create({
      baseURL: baseUrl,
      headers: {},
    })

    axiosInstance.current.interceptors.response.use((response) => {
      return response.data
    })

    return () => {
      console.log('[useBackendRequest] cleaned')
      axiosInstance.current = undefined
    }
  }, [baseUrl])

  return { axiosInstance, isReady }
}

export const useCrudBackend = (basePath) => {
  const { axiosInstance, isReady } = useBackendRequest()

  return {
    backendRequest: axiosInstance,
    endpoints: {
      isReady,
      create: async (data) => {
        return await axiosInstance.current.post(basePath, data)
      },
      read: async (id) => {
        return await axiosInstance.current.get(`${basePath}/${id}`)
      },
      readAll: async (params) => {
        return await axiosInstance.current.get(`${basePath}`, { params })
      },
      update: async (id, data, params = {}) => {
        return await axiosInstance.current.patch(`${basePath}/${id}`, data, { params })
      },
      delete: async (id, params = {}) => {
        return await axiosInstance.current.delete(`${basePath}/${id}`, { params })
      },
    },
  }
}
