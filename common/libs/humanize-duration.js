import humanizeDuration from 'humanize-duration'
import { langEnum, useLang } from './localization'

const humanizer = humanizeDuration.humanizer
if (typeof humanizer !== 'function') {
  // TODO DEBUG issue with this lib: "humanizeDuration.humanizer is not a function"
  console.log('humanizeDuration:', humanizeDuration)
  console.log('humanizer:', humanizeDuration?.humanizer)
}

export const shortHumanizeDuration = humanizer({
  language: langEnum.en,
  spacer: '',
  largest: 1,
  round: true,
  languages: {
    [langEnum.en]: {
      y: () => 'y',
      mo: () => 'mo',
      w: () => 'w',
      d: () => 'd',
      h: () => 'h',
      m: () => 'm',
      s: () => 's',
      ms: () => 'ms',
    },
    [langEnum.fr]: {
      y: () => 'a',
      mo: () => 'mo',
      w: () => 's',
      d: () => 'j',
      h: () => 'h',
      m: () => 'm',
      s: () => 's',
      ms: () => 'ms',
    },
    [langEnum.es]: {
      y: () => 'a',
      mo: () => 'me',
      w: () => 's',
      d: () => 'd',
      h: () => 'h',
      m: () => 'm',
      s: () => 's',
      ms: () => 'ms',
    },
  },
})

export function useShortHumanizeDuration() {
  const lang = useLang()
  return (ms, options) => shortHumanizeDuration(ms, { language: lang, ...options })
}
