import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Allow to show the entire HTML when test fails
process.env.DEBUG_PRINT_LIMIT = 100000

// By default mock authentication
vi.mock('oidc-client-ts')
vi.mock('jwt-decode')

// Mock the ResizeObserver
const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Stub the global ResizeObserver
vi.stubGlobal('ResizeObserver', ResizeObserverMock)
