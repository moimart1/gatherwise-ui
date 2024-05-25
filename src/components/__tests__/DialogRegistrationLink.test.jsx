import { render } from '@testing-library/react'
import React from 'react'
import { beforeEach, expect, test, vi } from 'vitest'
import DialogRegistrationLink from '../DialogRegistrationLink'

beforeEach(() => {
  vi.clearAllMocks()
})

test('should show nothing', async () => {
  const component = render(<DialogRegistrationLink open={false} onClose={() => null} />)
  expect(component.queryAllByText('Registration link')).toHaveLength(0)
})

test('should show dialog', async () => {
  const component = render(<DialogRegistrationLink open={true} onClose={() => null} />)
  expect(component.getByText('Registration link')).toBeVisible()
})
