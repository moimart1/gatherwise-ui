import { localize } from './libs/localization'
import Home from './pages/Home'
import Import from './pages/Import'
import NotFound from './pages/NotFound'
import Settings from './pages/Settings'
import Transactions from './pages/Transactions'

const routes = ({ lang }) => [
  {
    index: true,
    path: '/',
    title: localize('home')(lang),
    element: <Home />,
  },
  {
    path: '/settings',
    showMenu: false,
    title: localize('settings')(lang),
    element: <Settings />,
  },
  {
    path: '/imports',
    menu: {
      title: localize('Import')(lang),
    },
    element: <Import />,
  },
  {
    path: '/transactions',
    menu: {
      title: localize('transactions')(lang),
    },
    element: <Transactions />,
  },
  {
    path: '*',
    element: <NotFound />,
    isProtected: false,
    wrapFrame: false,
  },
]

export default routes
