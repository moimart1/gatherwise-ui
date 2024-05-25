import { getServiceOrigin } from '@gatherwise/common-frontend-libs/libs/urls'
import ApplicationTestContextProvider from '@gatherwise/common-frontend-libs/test-helpers/components/ApplicationTestContextProvider'
import { render, screen, waitFor } from '@testing-library/react'
import axios from 'axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import { expect, test, vi } from 'vitest'
import * as RoutedPage from '../Home'

const mockRequest = new AxiosMockAdapter(axios, { delayResponse: 0 })

const renderPage = ({ useBackendAbility = false } = {}) => {
  return render(
    <ApplicationTestContextProvider
      useBackendAbility={useBackendAbility}
      routes={[
        {
          path: '/',
          ...RoutedPage,
        },
        {
          path: '/new',
          Component: () => <div>on /new test page</div>,
        },
        {
          path: '/c/id-1',
          Component: () => <div>on /c/id-1 test page</div>,
        },
        {
          path: '/switch-to',
          Component: () => <div>on /switch-to test page</div>,
        },
      ]}
      routeOptions={{
        initialEntries: ['/'],
      }}
    />
  )
}

test('Should redirect to New page', async () => {
  vi.spyOn(window, 'location', 'get').mockReturnValue({ origin: getServiceOrigin() })
  mockRequest.onGet(new RegExp('.*/api/companies.*')).replyOnce(200, [])

  renderPage()
  await waitFor(() => {
    expect(screen.getByText('on /new test page')).toBeInTheDocument()
  })
})

test('Should redirect to company page', async () => {
  mockRequest.onGet(new RegExp('.*/api/companies.*')).replyOnce(200, [
    {
      _id: `id-1`,
      displayName: `Company 1`,
      slugName: `company-1`,
    },
  ])

  renderPage()
  await waitFor(() => {
    expect(screen.getByText('on /c/id-1 test page')).toBeInTheDocument()
  })
})

test('Should redirect to Switch page', async () => {
  mockRequest.onGet(new RegExp('.*/api/companies.*')).replyOnce(200, [
    {
      _id: `id-1`,
      displayName: `Company 1`,
      slugName: `company-1`,
    },
    {
      _id: `id-2`,
      displayName: `Company 2`,
      slugName: `company-2`,
    },
  ])

  renderPage()
  await waitFor(() => {
    expect(screen.getByText('on /switch-to test page')).toBeInTheDocument()
  })
})
