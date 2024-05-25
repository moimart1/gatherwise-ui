import ApplicationTestContextProvider from '@gatherwise/common-frontend-libs/test-helpers/components/ApplicationTestContextProvider'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { beforeEach, expect, test, vi } from 'vitest'
import CompanyForm from '../CompanyForm'

beforeEach(() => {
  vi.clearAllMocks()
})

test('should show empty company form', async () => {
  render(
    <ApplicationTestContextProvider>
      <CompanyForm />
    </ApplicationTestContextProvider>
  )

  expect(await screen.findByLabelText('Company name')).toHaveValue('')
  expect(screen.getByLabelText('Slug name')).toHaveValue('')
})

test('should show existing company form', async () => {
  render(
    <ApplicationTestContextProvider>
      <CompanyForm formData={{ displayName: 'My company', slugName: 'my-company' }} />
    </ApplicationTestContextProvider>
  )

  expect(await screen.findByLabelText('Company name')).toHaveValue('My company')
  expect(screen.getByLabelText('Slug name')).toHaveValue('my-company')
})
