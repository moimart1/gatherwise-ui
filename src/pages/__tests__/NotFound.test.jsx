import { render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import NotFound from '../NotFound'

test('Should Show Not found Error and child components', async () => {
  render(
    <BrowserRouter>
      <NotFound>
        <a> Test </a>
      </NotFound>
    </BrowserRouter>
  )

  await waitFor(() => {
    // Show 404 Error
    screen.getByText('Not found')
  })

  // Show Children component
  screen.getByText('Test')
})
