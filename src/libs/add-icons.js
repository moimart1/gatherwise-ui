import { library } from '@fortawesome/fontawesome-svg-core'
import { faEdit } from '@fortawesome/free-solid-svg-icons/faEdit'

const addIcons = () => {
  // NOTE importing icons into a library makes them available
  // in any child component without importing again

  // NOTE add free solid
  library.add(faEdit)
}

export default addIcons
