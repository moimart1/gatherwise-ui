import { tokensKeyLS } from './constants'

export const tokensLS = {
  getItem: () => {
    return JSON.parse(localStorage.getItem(tokensKeyLS))
  }, // Get keycloak token if present on localStorage
  setItem: (value) => {
    localStorage.setItem(tokensKeyLS, JSON.stringify(value))
  },
  removeItem: () => {
    localStorage.removeItem(tokensKeyLS)
  },
}
