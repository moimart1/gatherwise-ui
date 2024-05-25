import { faEllipsisV } from '@fortawesome/pro-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import React, { cloneElement, forwardRef, useMemo } from 'react'
import { classNames } from '../../../libs/style'

export default function ThreeDotButton({ className, itemsClassName, children, size = '1x' }) {
  const Components = useMemo(() => {
    return React.Children.map(
      children,
      (child, i) => {
        const ChildMenuItem = forwardRef((props, ref) => {
          return (
            <MenuItem as={'div'} className={''}>
              {(actions) => cloneElement(child, { ...child.props, ...props, ...actions, ref })}
            </MenuItem>
          )
        })

        return <ChildMenuItem key={i} />
      },
      []
    )
  })

  return (
    <Menu>
      <MenuButton className={className}>
        <FontAwesomeIcon {...{ icon: faEllipsisV, size }} />
      </MenuButton>
      <MenuItems className='absolute right-0 z-100 m-1 mt-2 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
        <div className={itemsClassName}>{Components}</div>
      </MenuItems>
    </Menu>
  )
}

ThreeDotButton.MenuItem = ({ active, className, children }) => {
  return <div className={classNames(className, active && 'bg-midnight-100')}>{children}</div>
}
