import { allLanguages } from '../libs/localization'
import { useLanguageContext } from '../providers/LanguageProvider'
import Dropdown from './materials/Dropdown/Dropdown'

export default function LanguageSelect() {
  const { lang, setLang } = useLanguageContext()

  return (
    <Dropdown
      className={'w-full border border-midnight-100'}
      value={lang}
      onChange={setLang}
      items={allLanguages.reduce((acc, language) => {
        acc[language.id] = language.name
        return acc
      }, {})}
    />
  )
}
