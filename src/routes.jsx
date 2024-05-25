import { withAppLayout } from '@gatherwise/common-frontend-libs/components/AppLayout'
import { Action, Subject } from '@gatherwise/common-frontend-libs/libs/authorization'
import { Outlet, createBrowserRouter } from '@gatherwise/common-frontend-libs/libs/router'
import { companyPath } from '@gatherwise/common-frontend-libs/libs/urls'
import ErrorBoundary from '@gatherwise/common-frontend-libs/pages/ErrorBoundary'
import NotFound from '@gatherwise/common-frontend-libs/pages/NotFound'

export function getRoutes({ sitePreferences }) {
  const withAdminAppLayout = withAppLayout({
    sitePreferences,
    menuMap: [
      {
        key: 'overview',
        path: `${companyPath(':companyId')}`,
        exactPath: true,
        ability: { action: Action.Read, subject: Subject.Company },
      },
      {
        key: 'users',
        path: `${companyPath(':companyId')}/users`,
        ability: { action: Action.ReadAllFromCompany, subject: Subject.User },
      },
      {
        key: 'companies',
        path: `${companyPath(':companyId')}/my-companies`,
        ability: { action: Action.ReadFromParent, subject: Subject.Company },
      },
      {
        key: 'settings',
        path: `${companyPath(':companyId')}/settings`,
      },
    ],
  })
  const withAdminAppLayoutWithoutMenu = withAppLayout({ sitePreferences, menuMap: [] })

  return [
    {
      id: 'root',
      path: '/',
      errorElement: <ErrorBoundary />,
      Component: withAdminAppLayout(Outlet),
      children: [
        {
          index: true,
          lazy: () => import('./pages/Home'),
        },
        {
          path: '/imports',
          lazy: () => import('./pages/Import'),
        },
        {
          path: '/transactions',
          lazy: () => import('./pages/Transactions'),
        },
        {
          path: '/settings',
          lazy: async () => import('./pages/SettingsExpert'),
        },
      ],
    },
    {
      path: '*',
      Component: NotFound,
    },
  ]
}

export function getRouter({ sitePreferences }) {
  return createBrowserRouter(getRoutes({ sitePreferences }))
}
