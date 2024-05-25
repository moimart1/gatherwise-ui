import ApplicationTestContextProvider from '@gatherwise/common-frontend-libs/test-helpers/components/ApplicationTestContextProvider'
import { render, screen } from '@testing-library/react'
import axios from 'axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import { beforeAll, beforeEach, expect, test, vi } from 'vitest'
import { MachineAdminState } from '../../libs/constants'
import { routes } from './test-routes'

const mockRequest = new AxiosMockAdapter(axios, { delayResponse: 0, onNoMatch: 'throwException' })

beforeAll(async () => {})

beforeEach(() => {
  vi.clearAllMocks()
})

const renderCompanyOverview = ({ useBackendAbility = false, companyId = '' } = {}) => {
  return render(
    <ApplicationTestContextProvider
      useBackendAbility={useBackendAbility}
      routes={routes}
      routeOptions={{
        initialEntries: [`/c/${companyId}`],
      }}
    />
  )
}

test('should return to main page if no companyId', async () => {
  mockRequest.onGet(new RegExp('.*/api/companies/.*')).replyOnce(404, {
    error: { message: 'TEST: Not found' },
  })

  renderCompanyOverview({ companyId: 'not-found' })
  // Since the loader fails, got the default error message
  expect(await screen.findByText('TEST: Not found')).toBeVisible()
})

test('should return company overview', async () => {
  mockRequest.onGet(new RegExp('.*/api/companies/.*')).replyOnce(200, {
    _id: `id-1`,
    displayName: `Company 1`,
    slugName: `company-1`,
  })

  mockRequest.onGet(new RegExp('.*/api/users/count')).replyOnce(200, [
    {
      total: 1,
    },
  ])

  mockRequest.onGet(new RegExp('.*/api/workstations/count')).replyOnce(200, [
    {
      total: 3,
      [MachineAdminState.Deleted]: 1,
      [MachineAdminState.Activated]: 1,
      [MachineAdminState.Billable]: 1,
    },
  ])

  renderCompanyOverview({ companyId: 'id-1' })

  await screen.findByText('Update company name')

  expect(screen.getByText('Show expert information')).toBeVisible()
})
