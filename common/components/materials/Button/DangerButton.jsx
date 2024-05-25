import { classNames } from '../../../libs/style'
import { withStyledButton } from './Button'

export default withStyledButton(({ disabled }) =>
  classNames('border-red-500 text-white bg-red-500', !disabled && 'hover:bg-midnight-50 hover:text-red-500')
)
