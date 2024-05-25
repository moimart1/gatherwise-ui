import { vi } from 'vitest'

export default function debounce(fn, time) {
  const m = vi.fn().mockImplementation(() => {
    return fn()
  })
  m._time = time
  return m
}
