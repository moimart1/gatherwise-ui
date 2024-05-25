import { defineTestAbility } from '@gatherwise/common-frontend-libs/test-helpers/authorization/ability'
import { mockRoles, mockRules } from '@gatherwise/common-frontend-libs/test-helpers/authorization/http-mock'
import ApplicationTestContextProvider from '@gatherwise/common-frontend-libs/test-helpers/components/ApplicationTestContextProvider'
import { waitForNoLoadingInDocument } from '@gatherwise/common-frontend-libs/test-helpers/wait-for'
import { render, screen, waitFor } from '@testing-library/react'
import { default as userEvent } from '@testing-library/user-event'
import axios from 'axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import { beforeAll, beforeEach, expect, test, vi } from 'vitest'
import { routes } from './test-routes'

const mockRequest = new AxiosMockAdapter(axios, { delayResponse: 0 })

beforeAll(async () => {
  mockRules(mockRequest, defineTestAbility())
  mockRoles(mockRequest)
})

beforeEach(() => {
  vi.clearAllMocks()
  mockRequest.onPost(new RegExp('.*/api/users.*')).replyOnce(201, {})

  mockRequest.onGet(new RegExp('.*/api/companies/.*')).replyOnce(200, {
    _id: `id-1`,
    displayName: `Company 1`,
    slugName: `company-1`,
  })

  mockRequest.onGet(new RegExp('.*/api/users.*')).reply(200, [
    {
      _id: 'user-1',
      username: 'john@doe.com',
      firstName: 'John',
      lastName: 'Doe',
    },
    {
      _id: 'user-2',
      username: 'hello@world.com',
      firstName: 'Hello',
      lastName: 'Word',
    },
    {
      _id: 'user-2',
      username: 'jean@moulin.com',
      firstName: 'Jean',
      lastName: 'Moulin',
    },
  ])
})

const renderPage = async ({ useBackendAbility = false } = {}) => {
  const component = render(
    <ApplicationTestContextProvider
      useBackendAbility={useBackendAbility}
      routes={routes}
      routeOptions={{
        initialEntries: ['/c/id-1/users'],
      }}
    />
  )

  await waitForNoLoadingInDocument()
  return component
}

test('should return users list', async () => {
  const component = await renderPage()

  await component.findByText('Roles')
  await waitFor(() => {
    // Should see at least one user in list
    expect(component.getByText('John Doe')).toBeVisible()
  })
})

test('should show add user and set user in lowercase', async () => {
  const component = await renderPage({ useBackendAbility: true })
  await component.findByText('Roles')

  // Shouldn't show Admin role (only visible when drawer is open)
  expect(component.queryByText('Company admin')).toBeNull()

  const addUserButton = await screen.findByRole('button', { name: /add user/i })
  await userEvent.click(addUserButton)

  // Wait for drawer is open
  await component.findByText('Company admin')

  // Should show the example of fake email
  expect(component.getByText('name@company.com')).toBeVisible()

  // Fill the username field with uppercase
  const usernameText = 'TestUser@Company.com'
  const usernameTextBox = await screen.findByRole('textbox', { id: 'username-label' })
  await userEvent.type(usernameTextBox, usernameText)

  // Add user
  const addUserButtonDrawer = await screen.findByRole('button', { name: 'Add user' })
  await userEvent.click(addUserButtonDrawer)

  // Request should be sent with lowercase
  await waitFor(() => expect(mockRequest.history.post.length).toBe(1))

  const { username } = JSON.parse(mockRequest.history.post[0].data)
  expect(username).toBe(usernameText.toLowerCase())
})

test('should show edit user', async () => {
  const component = await renderPage()
  await screen.findAllByTitle('edit')

  expect(component.queryByText('Reset password')).toBeNull()

  const editUserButtons = screen.getAllByTitle('edit')
  expect(editUserButtons).toHaveLength(3) // mock return 3 users, 1 edit button by user

  userEvent.click(editUserButtons[0])

  await component.findByText('Reset password')

  expect(component.getByText('user-1')).toBeVisible()
})
