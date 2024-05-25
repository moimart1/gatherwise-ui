import { classNames } from '../../../libs/style'
import { withStyledButton } from './Button'

export default withStyledButton(({ disabled }) =>
  classNames(
    'border-midnight bg-midnight text-midnight-50',
    !disabled && 'hover:bg-midnight-50 hover:text-midnight hover:border-midnight'
  )
)
