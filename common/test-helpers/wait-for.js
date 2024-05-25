import { screen, waitFor } from '@testing-library/react'
import { act } from 'react'
import { expect } from 'vitest'
import { AuthModule } from '../libs/authentication'

export async function waitForNoLoadingInDocument() {
  return await waitFor(
    () => {
      expect(screen.queryByText(/Loading.*/)).not.toBeInTheDocument()
    },
    { timeout: 8 * 1000 } // Put less than runner timeout
  )
}

export async function waitForForceAuthenticatedUser() {
  // Wait for authenticated user
  await act(async () => {
    // Use act() because getUser trig some state changes
    await new Promise((resolve) => AuthModule.getService().then(async (authService) => resolve(await authService.getUser())))
  })
}
