import { classNames } from '../../../libs/style'

export default function Input({ className, disabled, ...props }) {
  return (
    <input
      disabled={disabled}
      className={classNames(
        className,
        'rounded border-midnight-500 ring-0 focus:border-midnight focus:outline-none focus:ring-0',
        disabled && 'opacity-50'
      )}
      {...props}
    />
  )
}
