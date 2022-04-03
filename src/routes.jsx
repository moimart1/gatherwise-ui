import React from 'react'
import { localize } from './libs/localization'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Settings from './pages/Settings'

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
    path: '*',
    element: <NotFound />,
    isProtected: false,
    wrapFrame: false,
  },
]

export default routes
