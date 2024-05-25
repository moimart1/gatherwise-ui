import ApplicationTestContextProvider from '@gatherwise/common-frontend-libs/test-helpers/components/ApplicationTestContextProvider'
import { render, screen } from '@testing-library/react'
import { beforeEach, expect, test, vi } from 'vitest'
import CompaniesList from '../CompaniesList'

beforeEach(() => {
  vi.clearAllMocks()
})

test('should show the name of the company', async () => {
  render(
    <ApplicationTestContextProvider>
      <CompaniesList companies={[{ _id: 'my-id', displayName: 'My super company' }]} />
    </ApplicationTestContextProvider>
  )

  // Check if text present
  expect(await screen.findByText('My super company')).toBeInTheDocument()
})
