import { faEllipsisV } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { classNames } from '../libs/style'

const buttonsClassNames = ({ disabled, selected }) => {
  return (
    'inline-block px-3 py-2 border-gray-400 border text-black text-xs ' +
    ' focus:outline-none focus:ring-0 transition duration-150 ease-in-out ' +
    `${disabled ? 'hover:bg-transparent active:bg-transparent' : 'hover:bg-gray-300 active:bg-gray-400'} ` +
    `${selected ? 'bg-gray-500 text-gray-50' : 'bg-white'} `
  )
}

export default function ButtonGroupWithDropdown({ actions, additionalActions, className, disabled = false }) {
  const containsAdditionalActions = Array.isArray(additionalActions) && additionalActions.length > 0

  return (
    <div className={className}>
      <Menu as='div' className='relative inline-block text-right'>
        <div>
          {actions.map((action, i) => {
            let positionalClassNames = 'rounded border'
            if (i === 0 && (actions.length > 1 || containsAdditionalActions)) {
              positionalClassNames = 'rounded-l border-t border-l border-b border-r-0'
            } else if (i > 0 && (i < actions.length - 1 || containsAdditionalActions)) {
              positionalClassNames = 'border-t border-l border-b border-r-0'
            } else if (i >= actions.length - 1 && actions.length > 1) {
              positionalClassNames = 'border rounded-r'
            }

            return (
              <button
                key={i}
                disabled={disabled || action?.disabled}
                className={
                  `${positionalClassNames} ` +
                  `${buttonsClassNames({ disabled: action?.disabled || disabled, selected: action?.selected })} `
                }
                onClick={action?.onClick}
              >
                {action?.text}
              </button>
            )
          })}

          {containsAdditionalActions && (
            <MenuButton className={`rounded-r border-l ${buttonsClassNames({ disabled, selected: false })}`}>
              <FontAwesomeIcon {...{ icon: faEllipsisV, color: 'black' }} />
            </MenuButton>
          )}
        </div>

        <MenuItems className='absolute right-0 z-100 mt-2 origin-top-right rounded-md bg-white px-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
          <div className='py-1'>
            {containsAdditionalActions &&
              additionalActions.map((action, i) => {
                const isDisabled = action?.disabled || disabled
                return (
                  <MenuItem key={i}>
                    {({ focus }) => (
                      <button
                        className={classNames(
                          focus ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                          'block whitespace-nowrap px-4 py-2 text-sm',
                          `${isDisabled ? 'opacity-50 hover:bg-transparent active:bg-transparent' : ''}`
                        )}
                        disabled={isDisabled}
                        onClick={action?.onClick}
                      >
                        {action?.text}
                      </button>
                    )}
                  </MenuItem>
                )
              })}
          </div>
        </MenuItems>
      </Menu>
    </div>
  )
}
