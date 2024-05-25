import { BackendException } from './backend'

/**
 * Transform an error to something more human readable
 * @param {Error} error Error to transform
 * @param {Object} options Additional options
 * @param {function(string):string} options.localize Localize function
 * @returns {String} Human readable error
 */
export function humanError(error, { localize } = {}) {
  localize = localize ? localize : (key) => key
  let message = ''
  if (error instanceof BackendException) {
    switch (error.status) {
      case 403:
        if (error?.message.includes('QUOTA_EXCEEDED')) {
          message += `${localize('quota exceeded')} [${error.message}]: `
        } else {
          message += `${localize('unauthorized')}: `
        }

        message += `${localize('when call')} ${error.endpoints}`
        break
      case 404:
        message += `${localize('unable to found the resource')}. ${localize('when call')} ${error.endpoints}`
        break
      default:
        message +=
          `${localize('got status')} ${error.status}. ${localize('with message')} '${error.message}'. ` +
          `${localize('when call')} ${error.endpoints}`
        break
    }
  } else {
    message += `${localize(error.message)}`
  }

  return message
}
