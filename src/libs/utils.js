export const UT = {
  isValidJSON: ({ string }) => {
    if (!string) return false
    try {
      const o = JSON.parse(string)
      if (o && typeof o === 'object') return true
    } catch (e) {
      return false
    }
  },
  getLanguageInfoById: ({ id }) => {
    const allLanguages = [
      { id: 'en', abbreviation: 'EN', name: 'English' }, // NOTE: use English as fallback
      { id: 'fr', abbreviation: 'FR', name: 'French' },
      { id: 'es', abbreviation: 'ES', name: 'Spanish' },
    ]
    const chosenLang = allLanguages.find((langItem) => langItem.id === id) || allLanguages[0]
    return { allLanguages, chosenLang }
  },
}
