const history = [] // Global history to get all requests

export function mockHttpGetHistory(onlyName = false) {
  if (onlyName) {
    return history.map((item) => item.name)
  }

  return history.reduce((acc, item, index) => {
    acc[`#${String(index + 1).padStart(2, '0')} ${item.name}`] =
      item?.config ?
        {
          headers: Object.keys(item.config?.headers ?? []).reduce((acc, key) => {
            const value = item.config.headers[key]
            acc[key] = value ? `${typeof value}` : 'empty'
            if (value?.length) acc[key] += `(${value.length})`
            return acc
          }, {}),
        }
      : '' // Show info only if config is defined;

    return acc
  }, {})
}

export function mockHttpAddHistoryStep(name) {
  history.push({ name: `--- ${name} ---` })
}

export function mockHttpClearHistory() {
  history.splice(0, history.length) // clear
}

export function mockHttp(mockRequest) {
  return {
    mockRequestWithHistory: (method, matcher, { useMatcherInHistory = false }, callback) => {
      let requestHandler

      switch (method) {
        case 'GET':
          requestHandler = mockRequest.onGet(matcher)
          break
        case 'POST':
          requestHandler = mockRequest.onPost(matcher)
          break
        case 'PATCH':
          requestHandler = mockRequest.onPatch(matcher)
          break
        case 'PUT':
          requestHandler = mockRequest.onPut(matcher)
          break
        case 'DELETE':
          requestHandler = mockRequest.onDelete(matcher)
          break
        default:
          requestHandler = mockRequest.onAny(matcher)
          break
      }

      requestHandler.reply((config) => {
        const fullUrl = (config.baseURL ? config.baseURL : '') + config.url
        // Push call to history with name based on matcher or request url (remove backslashes)
        history.push({
          name: `${method} ${useMatcherInHistory ? matcher : fullUrl}`.replace(/\\/g, ''),
          config,
        })
        const match = matcher instanceof RegExp ? matcher.exec(fullUrl) : undefined
        return callback(config, { matcher, match })
      })
    },
    mockHttpReset: () => {
      this.mockHttpClearHistory()
      mockRequest.reset()
    },
  }
}
