import { Menu as MenuBase, MenuButton, MenuItem, MenuItems } from '@headlessui/react'

export default function Menu({ className, items, children }) {
  return (
    <MenuBase as='div' className={className}>
      <MenuButton>{children}</MenuButton>
      <MenuItems className='absolute right-0 z-100 mt-2 flex origin-top-right flex-col rounded-md bg-white px-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
        {Array.isArray(items) &&
          items.map((item) => {
            return (
              <MenuItem key={item.key ?? item.name}>
                {({ focus }) => (
                  <div
                    className={`${focus && 'bg-gray-100'} h-full w-full cursor-pointer`}
                    onClick={() => {
                      item.onClick && item.onClick(item)
                    }}
                  >
                    {item.name}
                  </div>
                )}
              </MenuItem>
            )
          })}
        <MenuItem>
          {({ focus }) => (
            <a className={`${focus && 'bg-gray-100'}`} href='/account-settings'>
              Account settings
            </a>
          )}
        </MenuItem>
        <MenuItem>
          {({ focus }) => (
            <a className={`${focus && 'bg-blue-500'}`} href='/account-settings'>
              Documentation
            </a>
          )}
        </MenuItem>
        <MenuItem disabled>
          <span className='opacity-75'>Invite a friend (coming soon!)</span>
        </MenuItem>
      </MenuItems>
    </MenuBase>
  )
}
