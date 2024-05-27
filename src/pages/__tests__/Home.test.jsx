import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import axios from 'axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import Keycloak from 'keycloak-js'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import AuthProvider from '../../components/AuthProvider'
import Home from '../Home'

const mockRequest = new AxiosMockAdapter(axios, { delayResponse: 0 })
jest.mock('keycloak-js')

const mockContext = { useParams: {} }
const mockedUsedNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
  useParams: () => mockContext.useParams,
}))

beforeAll(async () => {
  //setAuthClient()
})

test('Should redirect to New page', async () => {
  Keycloak.__setAuthenticated(true)
  mockContext.useParams = { companyId: 'id-1' }
  mockRequest.onGet(new RegExp('.*/api/companies.*')).replyOnce(200, [])

  render(
    <BrowserRouter>
      <AuthProvider clientId={'my-client-test'}>
        <Home />
      </AuthProvider>
    </BrowserRouter>
  )

  await waitFor(() => {
    // Check if text present
    expect(screen.getByText('Return to homepage')).toBeVisible()
  })

  expect(mockedUsedNavigate).toHaveBeenCalledWith('/new')
})

test('Should redirect to company page', async () => {
  Keycloak.__setAuthenticated(true)
  mockContext.useParams = { companyId: 'id-1' }
  mockRequest.onGet(new RegExp('.*/api/companies.*')).replyOnce(200, [
    {
      _id: `id-1`,
      displayName: `Company 1`,
      slugName: `company-1`,
    },
  ])

  render(
    <BrowserRouter>
      <AuthProvider clientId={'my-client-test'}>
        <Home />
      </AuthProvider>
    </BrowserRouter>
  )

  await waitFor(() => {
    // Check if text present
    expect(screen.getByText('Return to homepage')).toBeVisible()
  })

  expect(mockedUsedNavigate).toHaveBeenCalledWith('/c/id-1')
})

test('Should redirect to Switch page', async () => {
  Keycloak.__setAuthenticated(true)
  mockContext.useParams = { companyId: 'id-1' }
  mockRequest.onGet(new RegExp('.*/api/companies.*')).replyOnce(200, [
    {
      _id: `id-1`,
      displayName: `Company 1`,
      slugName: `company-1`,
    },
    {
      _id: `id-2`,
      displayName: `Company 2`,
      slugName: `company-2`,
    },
  ])

  render(
    <BrowserRouter>
      <AuthProvider clientId={'my-client-test'}>
        <Home />
      </AuthProvider>
    </BrowserRouter>
  )

  await waitFor(() => {
    // Check if text present
    expect(screen.getByText('Return to homepage')).toBeVisible()
  })

  expect(mockedUsedNavigate).toHaveBeenCalledWith('/switch-to')
})
