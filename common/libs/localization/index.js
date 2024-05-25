import React, { useContext } from 'react'
import translations, { langEnum } from './translations'

export { langEnum } from './translations'

export const LanguageContext = React.createContext(langEnum.en)

export const useLanguageContext = () => useContext(LanguageContext)

export function useLang() {
  const { lang } = useContext(LanguageContext)
  return lang
}

/*
npm run test 2> test.log
^(?!Missing).*\n
Missing translations for ('[\w0-9 .,-_]+').*

Translate following words and remove duplicates word:
settings
TODO

According to this JavaScript template:
const langEnum = {
  en: "en",
  fr: "fr",
  es: "es",
}

const translations = {
  "settings": {
    [langEnum.fr]: "configurations",
    [langEnum.es]: "ajustes",
  }
}
*/

export const localize =
  (key) =>
  (lang, { capitalize = true } = { capitalize: true }) => {
    if (!key) return '' // Return empty string if no key

    const translationsByLang = translations[key]
    let translation = ''

    if (!translationsByLang) {
      console.warn(`Missing translations for '${key}', template:
      '${key}': {
        [langEnum.fr]: '${key}',
        [langEnum.es]: '${key}',
      },`)
      translation = key
    } else if (translationsByLang && translationsByLang[lang]) {
      translation = translationsByLang[lang]
    } else {
      // By default the key is the english translation
      if (lang !== langEnum.en) {
        console.warn(`Missing translations for '${key}' and language '${lang}'`)
      }

      translation = key
    }

    if (capitalize) {
      translation = translation.charAt(0).toUpperCase() + translation.slice(1)
    }

    return translation
  }

export function useLocalize() {
  const lang = useLang()
  return (key, options) => localize(key)(lang, options)
}

export const allLanguages = [
  { id: langEnum.en, abbreviation: 'EN', name: 'English' },
  { id: langEnum.fr, abbreviation: 'FR', name: 'French' },
  { id: langEnum.es, abbreviation: 'ES', name: 'Spanish' },
]

export const getLanguageInfoById = ({ id }) => {
  const chosenLang = allLanguages.find((langItem) => langItem.id === id) || allLanguages[0] // NOTE: use English as fallback
  return { allLanguages, chosenLang }
}

export const addTranslations = (otherTranslations) => {
  Object.assign(translations, otherTranslations)
}
