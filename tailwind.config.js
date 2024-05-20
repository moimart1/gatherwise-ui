import tailwindConfig from '@gatherwise/common-frontend-libs/tailwind.config'

export default {
  ...tailwindConfig,
  content: ['./src/**/*.{js,jsx,ts,tsx}', './index.html', './common/**/*.{js,jsx,ts,tsx}'],
}
