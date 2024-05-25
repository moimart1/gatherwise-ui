import { render } from '@testing-library/react'
import React from 'react'
import { beforeEach, expect, test, vi } from 'vitest'
import DialogUserTemporaryPassword from '../DialogUserTemporaryPassword'

beforeEach(() => {
  vi.clearAllMocks()
})

test('should show nothing', async () => {
  const component = render(<DialogUserTemporaryPassword open={false} onClose={() => null} />)
  expect(component.queryAllByText('Temporary password')).toHaveLength(0)
})

test('should show dialog', async () => {
  const component = render(<DialogUserTemporaryPassword open={true} onClose={() => null} />)
  expect(component.getByText('Temporary password')).toBeVisible()
})
