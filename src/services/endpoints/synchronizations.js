import { ApiRequest, Crud, useCrud } from '../../libs/backend'

const basePath = '/synchronizations'
const options = {
  needAuthenticated: false,
}

const crud = Crud(basePath, options)

export default {
  basePath,
  ...crud,
  getContext: () => {
    return ApiRequest('GET', `${basePath}/context`, options)
  },
  ...useCrud(crud),
}
