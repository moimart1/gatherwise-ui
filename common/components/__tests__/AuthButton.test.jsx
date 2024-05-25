import { render, screen, waitFor } from '@testing-library/react'
import { default as userEvent } from '@testing-library/user-event'
import React from 'react'
import { expect, test } from 'vitest'
import AuthButton from '../AuthButton'

test.skip('Should login and logout when clicked', async () => {
  render(<AuthButton />)

  const login = screen.getByRole('button', { name: 'Login' })

  // User is not authenticated -> Button text = login
  // Click on login button
  userEvent.click(login)
  // User authentified -> Button text = logout

  await waitFor(() => {
    expect(login.textContent).toBe('Logout')
  }, 0)

  const logout = screen.getByRole('button', { name: 'Logout' })
  expect(logout.textContent).toBe('Logout')

  // Click on logout button
  userEvent.click(logout)
  // User is not authenticated -> Button text = login
  await waitFor(() => {
    expect(login.textContent).toBe('Login')
  }, 0)
})
