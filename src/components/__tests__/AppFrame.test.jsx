import { render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { setAuthClient } from '../../services/user'
import AppFrame from '../AppFrame'

jest.mock('keycloak-js')
jest.mock('@react-keycloak/web', () => {
  return {
    useKeycloak: () => {
      return { initialized: true, keycloak: { authenticated: true } }
    },
  }
})

beforeAll(() => {
  setAuthClient() // Init empty auth client

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
      <AppFrame
        menuMap={navigation}
        sitePreferences={{ title: 'TEST', logo: '' }}
      >
        <a> Test </a>
      </AppFrame>
    </BrowserRouter>
  )
})

test('Should show menu from navigation props', async () => {
  await waitFor(() => {
    screen.getByText('Menu 1')
    screen.getByText('Menu 2')
  })
})
