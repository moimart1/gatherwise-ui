import { classNames } from '../../../libs/style'
import { withStyledButton } from './Button'

export default withStyledButton(({ disabled }) =>
  classNames('border-red-500 text-red-500 bg-white', !disabled && 'hover:bg-midnight-50')
)
