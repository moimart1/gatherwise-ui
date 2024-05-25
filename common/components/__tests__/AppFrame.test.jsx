import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { beforeAll, test } from 'vitest'
import AppFrame from '../AppFrame'

beforeAll(() => {
  const navigation = [
    {
      title: 'Menu 1',
      path: '/menu-1',
      icon: null,
    },
    {
      title: 'Menu 2',
      path: '/menu-2',
      icon: null,
    },
  ]

  render(
    <BrowserRouter>
      <AppFrame menuMap={navigation} sitePreferences={{ title: 'TEST', logo: '' }}>
        <a> Test </a>
      </AppFrame>
    </BrowserRouter>
  )
})

test.skip('Should show menu from navigation props', async () => {
  await waitFor(() => {
    screen.getByText('Menu 1')
    screen.getByText('Menu 2')
  })
})
