import { allLanguages } from '../libs/localization'

export default function LanguageSelect({ lang, onChangeLanguage }) {
  return (
    <form>
      <select
        defaultValue={lang}
        onChange={onChangeLanguage}
        inputProps={{
          name: 'lang',
          id: 'uncontrolled-native',
        }}
      >
        {allLanguages.map((language, index) => {
          return (
            <option key={index} value={language?.id}>
              {language?.name}
            </option>
          )
        })}
      </select>
    </form>
  )
}
