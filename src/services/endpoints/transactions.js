import { Crud, useCrud } from '../../libs/backend'

const basePath = '/transactions'
const options = {
  needAuthenticated: false,
}

const crud = Crud(basePath, options)

export default {
  basePath,
  ...crud,
  ...useCrud(crud),
}
