import { classNames } from '../../../libs/style'
import { withStyledButton } from './Button'

export default withStyledButton(({ disabled }) => classNames('border-midnight bg-white', !disabled && 'hover:bg-midnight-50'))
