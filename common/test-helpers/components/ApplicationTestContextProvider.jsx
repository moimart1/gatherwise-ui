import { ApplicationContextProvider } from '../../components/ApplicationContext'
import { AuthModule } from '../../libs/authentication/authentication'
import { createMemoryRouter } from '../../libs/router'

/**
 * @param {Object} options
 * @param {boolean} options.useBackendAbility
 * @param {boolean} options.useBroker
 * @param {import('react-router-dom').RouteObject[]} options.routes
 * @param {Object} options.routeOptions
 * @param {string[]} options.routeOptions.initialEntries Represent a navigation history
 * @param {number} options.routeOptions.initialIndex Index where to start in `initialEntries` (e.g. the history)
 * @param {JSX.Element} options.children
 * @returns {JSX.Element}
 */
export default function ApplicationTestContextProvider({
  useBackendAbility = false,
  useBroker = false,
  routes,
  routeOptions,
  children,
}) {
  if (!routes) {
    routes = []
  }

  if (children) {
    routes.push({
      path: '*',
      element: children,
    })
  }

  const router = createMemoryRouter(routes, routeOptions)
  AuthModule.useBackendAbility(useBackendAbility)
  return <ApplicationContextProvider useBroker={useBroker} router={router} />
}
