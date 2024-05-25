import { render, screen } from '@testing-library/react'
import React from 'react'
import { expect, test } from 'vitest'
import { Component as NextGen } from '../NextGen'

test('should show a next gen public page', () => {
  render(<NextGen />)
  // Check if text present
  expect(screen.getByText('NEXT-GEN coming soon…')).toBeVisible()
})
