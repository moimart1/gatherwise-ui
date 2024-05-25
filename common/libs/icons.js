import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faBars as fasBars,
  faChartBar as fasChartBar,
  faGear as fasGear,
  faRouter as fasRouter,
  faUserGear as fasUserGear,
  faXmark as fasXmark,
} from '@fortawesome/pro-solid-svg-icons'
export { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
export { library }

export default function addCommonIcons() {
  // NOTE importing icons into a library makes them available
  // in any child component without importing again

  // Solid
  library.add(fasXmark, fasBars, fasChartBar, fasRouter, fasUserGear, fasGear)
}
