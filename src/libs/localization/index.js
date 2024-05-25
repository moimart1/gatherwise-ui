import { addTranslations } from '@gatherwise/common-frontend-libs/libs/localization'
import translations from './translations'

export { LanguageContext, langEnum, localize, useLocalize } from '@gatherwise/common-frontend-libs/libs/localization'

addTranslations(translations)
