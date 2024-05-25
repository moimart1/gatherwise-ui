import { faPlus as fasPlus, faUser as fasUser } from '@fortawesome/free-solid-svg-icons'
import addCommonIcons, { library } from '@gatherwise/common-frontend-libs/libs/icons'

const addIcons = () => {
  // Add common icons
  addCommonIcons()

  // NOTE importing icons into a library makes them available
  // in any child component without importing again

  // Solid
  library.add(fasUser, fasPlus)
}

export default addIcons
