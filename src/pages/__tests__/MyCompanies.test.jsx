import ApplicationTestContextProvider from '@gatherwise/common-frontend-libs/test-helpers/components/ApplicationTestContextProvider'
import { waitForNoLoadingInDocument } from '@gatherwise/common-frontend-libs/test-helpers/wait-for'
import { render, screen } from '@testing-library/react'
import { default as userEvent } from '@testing-library/user-event'
import axios from 'axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import { expect, test } from 'vitest'
import { routes } from './test-routes'

const mockRequest = new AxiosMockAdapter(axios, { delayResponse: 0 })

const renderPage = async ({ useBackendAbility = false, companyId = '' } = {}) => {
  const component = render(
    <ApplicationTestContextProvider
      useBackendAbility={useBackendAbility}
      routes={routes}
      routeOptions={{
        initialEntries: [`/c/${companyId}/my-companies`],
      }}
    />
  )

  await waitForNoLoadingInDocument()
  return component
}

test('should show a list of my companies', async () => {
  mockRequest.onGet(new RegExp('.*/api/companies.*')).replyOnce(200, [
    {
      _id: `id-1`,
      displayName: `Company 1`,
      slugName: `company-1`,
      joined: true,
      hasChildren: true,
    },
    {
      _id: `id-2`,
      parent: { _id: 'id-1', displayName: 'Company 1' },
      displayName: `Company 2`,
      slugName: `company-2`,
      joined: true,
      hasChildren: true,
    },
    {
      _id: `id-3`,
      parent: { _id: 'id-1', displayName: 'Company 1' },
      displayName: `Company 3`,
      slugName: `company-3`,
      joined: false,
    },
    {
      _id: `id-4`,
      parent: { _id: 'id-2', displayName: 'Company 2' },
      displayName: `Company 4`,
      slugName: `company-4`,
      joined: true,
    },
  ])

  const { container } = await renderPage({ companyId: 'id-1' })

  await screen.findByText('Company 2')

  // Company 1 is the current company (companyId == 'id-1')
  // Then doesn't show it in MyCompanies page
  expect(screen.queryByText('Company 1')).toBeNull()

  // Company 2 is joined and child of current company (company-1)
  // Then show it in MyCompanies page as joined company
  expect(screen.getByText('Company 2')).toBeVisible()

  // Company 3 is not joined and child of current company (company-1)
  // Then show it in MyCompanies page as not joined company
  expect(screen.getByText('Company 3')).toBeVisible()

  // Company 4 is joined but not child of current company (company-1)
  // Then does show it in Company 2 section
  expect(screen.queryByText('Company 4')).toBeVisible()

  const iconPartners = container.querySelectorAll('[data-icon="diagram-project"]')
  expect(iconPartners).toHaveLength(1)
  expect(iconPartners[0]).toHaveAttribute('data-prefix', 'fas') // Font Awesome Solid == Joined partner
  expect(iconPartners[0].parentElement.nextElementSibling).toHaveTextContent('Company 2')

  const iconCustomers = container.querySelectorAll('[data-icon="industry"]')
  expect(iconCustomers).toHaveLength(2)
  expect(iconCustomers[0]).toHaveAttribute('data-prefix', 'far') // Font Awesome Regular == Not joined customer
  expect(iconCustomers[0].parentElement.nextElementSibling).toHaveTextContent('Company 3')
  expect(iconCustomers[1]).toHaveAttribute('data-prefix', 'fas') // Font Awesome Solid == Joined customer
  expect(iconCustomers[1].parentElement.nextElementSibling).toHaveTextContent('Company 4')
})

test('should show invitation link', async () => {
  mockRequest.onGet(new RegExp('.*/api/companies.*')).replyOnce(200, [])

  await renderPage({ companyId: 'id-1' })

  await screen.findByText('Show invitation link')

  const button = screen.getByRole('button', { name: 'Show invitation link' })
  await userEvent.click(button)

  expect(await screen.findByText('Registration link')).toBeVisible()
  expect(
    await screen.findByText(
      'https://sso.gatherwise.com' +
        '/realms/webapp/protocol/openid-connect/registrations' +
        '?client_id=website-registration&response_type=code&scope=openid&redirect_uri=http://localhost:3002/new?affiliate=' +
        window.btoa('{"parentId":"id-1"}').replace(/[=]/g, '.') // match urlencodeobject function
    )
  ).toBeVisible()
})
