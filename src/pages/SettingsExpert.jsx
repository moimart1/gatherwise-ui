import { Component as CommonSettingsExpert } from '@gatherwise/common-frontend-libs/pages/SettingsExpert'
import { dynamicHeaderConfig } from './Settings'

export { loader } from '@gatherwise/common-frontend-libs/pages/SettingsExpert'

export function Component() {
  return CommonSettingsExpert({ dynamicHeaderConfig })
}
