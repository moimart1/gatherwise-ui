import uniqueId from '../libs/id'
import { getBackendUrl } from '../libs/urls'
import { mockHttp } from './mock-http'

const context = {}
const initialContext = {}

export function mockCrudApiClearDb(basePath) {
  if (!Array.isArray(context[basePath])) context[basePath] = []
  context[basePath].splice(0, context[basePath].length) // clear
  if (Array.isArray(initialContext[basePath])) context[basePath].push(...initialContext[basePath])
}

export function mockCrudApi({ mockRequest, service, basePath, initialData }) {
  const { mockRequestWithHistory } = mockHttp(mockRequest)
  if (!context[basePath]) context[basePath] = []
  initialContext[basePath] = initialData ?? []

  // Init
  mockCrudApiClearDb(basePath)

  // Create
  mockRequestWithHistory('POST', getBackendUrl(service) + basePath, {}, (req) => {
    const data = JSON.parse(req.data)
    if (!data._id) data._id = uniqueId()
    context[basePath].push(data)
    return [200, data]
  })

  // Read all
  mockRequestWithHistory('GET', getBackendUrl(service) + basePath, {}, () => {
    return [200, context[basePath] ?? []]
  })

  // Read by id
  mockRequestWithHistory('GET', new RegExp(getBackendUrl(service) + `${basePath}/.*`), { useMatcherInHistory: true }, (req) => {
    const id = req.url.substring(req.url.lastIndexOf('/') + 1, req.url.length)
    const item = context[basePath].find((el) => el._id === id)

    return item ? [200, item] : [404, {}]
  })

  // Update
  mockRequestWithHistory('PATCH', new RegExp(getBackendUrl(service) + `${basePath}/.*`), { useMatcherInHistory: true }, (req) => {
    const data = JSON.parse(req.data)
    const id = req.url.substring(req.url.lastIndexOf('/') + 1, req.url.length)
    const itemIndex = context[basePath].findIndex((el) => el._id === id)
    if (itemIndex >= 0) {
      context[basePath][itemIndex] = {
        ...context[basePath][itemIndex],
        ...data,
      }

      return [200, context[basePath][itemIndex]]
    }

    return [404, {}]
  })

  // Delete
  mockRequestWithHistory(
    'DELETE',
    new RegExp(getBackendUrl(service) + `${basePath}/.*`),
    { useMatcherInHistory: true },
    (req) => {
      const id = req.url.substring(req.url.lastIndexOf('/') + 1, req.url.length)
      const itemIndex = context[basePath].findIndex((el) => el._id === id)
      if (itemIndex >= 0) {
        context[basePath].splice(itemIndex, 1)
        return [200, {}]
      }

      return [404, {}]
    }
  )

  return {
    mockRequestWithHistory,
  }
}
