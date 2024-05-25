import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { classNames } from '../../../libs/style'

/**
 * @param {string|function({disabled:boolean}):string} options className or function that returns className
 * @returns
 */
export const withStyledButton =
  (options) =>
  ({ className, disabled, children, ...props }) => {
    className = classNames(className, typeof options === 'function' ? options({ disabled }) : options)
    return <Button {...{ className, disabled, ...props }}>{children}</Button>
  }

export default function Button({ className, disabled, children, icon, ...props }) {
  // TODO debounce
  return (
    <button
      {...{
        ...props,
        className: classNames(className, 'border rounded px-2 py-1', disabled && 'opacity-50 cursor-not-allowed'),
        disabled,
      }}
    >
      {icon ?
        <span className='flex flex-row items-center space-x-1'>
          <FontAwesomeIcon icon={icon} />
          <span>{children}</span>
        </span>
      : children}
    </button>
  )
}
