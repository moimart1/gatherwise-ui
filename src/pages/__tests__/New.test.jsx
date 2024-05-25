import ApplicationTestContextProvider from '@gatherwise/common-frontend-libs/test-helpers/components/ApplicationTestContextProvider'
import { render, screen, waitFor } from '@testing-library/react'
import { default as userEvent } from '@testing-library/user-event'
import axios from 'axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import { beforeEach, expect, test } from 'vitest'
import * as RoutedPage from '../New'

const mockRequest = new AxiosMockAdapter(axios, { delayResponse: 0, onNoMatch: 'passthrough' })

const renderPage = ({ useBackendAbility = false, path = '/new' } = {}) => {
  return render(
    <ApplicationTestContextProvider
      useBackendAbility={useBackendAbility}
      routes={[
        {
          path: '/new',
          ...RoutedPage,
        },
      ]}
      routeOptions={{
        initialEntries: [path],
      }}
    />
  )
}

beforeEach(() => {
  mockRequest.reset()
  mockRequest.onAny(new RegExp('.*')).replyOnce(201, {})
})

test('should show create company', async () => {
  renderPage()

  expect(await screen.findByText('Company name')).toBeVisible()
})

test('should get the affiliate parent', async () => {
  // encodeUrlObjectParams({ parentId: 'abcdef0123456789' })
  const encodedAffiliate = 'eyJwYXJlbnRJZCI6ImFiY2RlZjAxMjM0NTY3ODkifQ..'
  renderPage({ path: `/new?affiliate=${encodedAffiliate}` })

  const companyDisplayNameInput = await screen.findByRole('textbox', { name: 'Company name' })
  await userEvent.type(companyDisplayNameInput, 'My affiliated company')
  expect(companyDisplayNameInput).toBeVisible()

  const saveButton = await screen.findByRole('button', { name: 'Save' })
  await userEvent.click(saveButton)

  // Request should be sent with lowercase
  await waitFor(() => expect(mockRequest.history.post.length).toBe(1))

  const { username, displayName, timezone, parentId } = JSON.parse(mockRequest.history.post[0].data)
  expect(displayName).toBe('My affiliated company')
  expect(parentId).toBe('abcdef0123456789')
  expect(username).toBe('')
  expect(typeof timezone === 'string' && timezone.length > 0).toBeTruthy()
})

test('should fill the honeypot', async () => {
  renderPage()

  const text = 'I am a bot'
  for (const input of await screen.findAllByRole('textbox')) {
    // Fill everything like a bot
    await userEvent.type(input, text)
    expect(input).toBeVisible()
  }

  const saveButton = await screen.findByRole('button', { name: 'Save' })
  await userEvent.click(saveButton)

  // Wait for API call
  await waitFor(() => expect(mockRequest.history.post.length).toBe(1))

  const { username, displayName, timezone } = JSON.parse(mockRequest.history.post[0].data)
  expect(displayName).toBe(text)
  expect(username).toBe(text) // Honeypot field
  expect(typeof timezone === 'string' && timezone.length > 0).toBeTruthy()
})
