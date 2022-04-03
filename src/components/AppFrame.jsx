import { Disclosure, Menu, Transition } from '@headlessui/react'
import { MenuIcon, XIcon } from '@heroicons/react/outline'
import PropTypes from 'prop-types'
import React, { Fragment, useContext, useState } from 'react'
import Avatar from 'react-avatar'
import { Link, NavLink } from 'react-router-dom'
import { LanguageContext } from '../libs/localization'
import { joinPaths } from '../libs/urls'
import LanguageSelect from './LanguageSelect'

const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ')
}

export default function AppFrame({
  children,
  sitePreferences,
  menuMap,
  onChangeLanguage,
}) {
  const lang = useContext(LanguageContext)
  const [user, setUser] = useState({
    avatar: (
      <Avatar
        {...{
          name: 'John Doe',
          size: 35,
          round: true,
          color: '#efa304',
          className: 'h-8 w-8 rounded-full font-bold',
        }}
      />
    ),
  })
  const userNavigation = [
    { name: 'Settings', href: '/settings' }, //  NOTE view token
    { name: <br />, href: '' }, // NOTE logout
  ]

  console.log(`[AppFrame] loaded with`, menuMap)
  return (
    <>
      <div className='min-h-full w-full' style={{ backgroundColor: '#191919' }}>
        <Disclosure
          key='menu'
          {...{
            as: 'nav',
            className: 'bg-gray-400 bg-opacity-10 border-b border-gray-100',
          }}
        >
          {({ open }) => (
            <>
              <div className='max-w-7xl mx-auto px-4 sm:px-4 md:px-6 lg:px-8'>
                <div className='flex justify-between h-14'>
                  <div className='flex items-center space-x-3'>
                    <div className='flex-shrink-0 flex items-center'>
                      <NavLink to={`/`}>
                        <img
                          className='block lg:hidden h-8 w-auto'
                          src={sitePreferences.logo}
                          alt='logo'
                        />
                        <img
                          className='hidden lg:block h-8 w-auto'
                          src={sitePreferences.logo}
                          alt='logo'
                        />
                      </NavLink>
                    </div>
                    <div className='hidden sm:-my-px sm:ml-2 sm:flex lg:space-x-3 sm:space-x-1'>
                      {menuMap.map((item) => {
                        return (
                          <NavLink
                            end={['', '/'].includes(item.path)}
                            key={item.path}
                            to={joinPaths(item.basename, item.path)}
                            className={({ isActive }) => {
                              return classNames(
                                isActive
                                  ? 'border-gray-500 text-gray-900'
                                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                                'inline-flex items-center px-1 pt-1 border-b-2 text-1xl'
                              )
                            }}
                          >
                            <span className=''>{item?.logo ?? item.title}</span>
                          </NavLink>
                        )
                      })}
                    </div>
                  </div>
                  <div className='flex flex-row items-center'>
                    <div className='hidden sm:ml-6 sm:flex sm:items-center'>
                      {/* Profile dropdown */}
                      <Menu as='div' className='ml-3 relative'>
                        <div>
                          <Menu.Button className='bg-white flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'>
                            <span className='sr-only'>Open user menu</span>
                            {user.avatar}
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter='transition ease-out duration-200'
                          enterFrom='transform opacity-0 scale-95'
                          enterTo='transform opacity-100 scale-100'
                          leave='transition ease-in duration-75'
                          leaveFrom='transform opacity-100 scale-100'
                          leaveTo='transform opacity-0 scale-95'
                        >
                          <Menu.Items className='origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50'>
                            <div className='px-2 pt-2 text-center'>
                              {user.name}
                            </div>

                            <div className='px-4 py-2 text-sm text-gray-700'>
                              <LanguageSelect
                                lang={lang}
                                onChangeLanguage={onChangeLanguage}
                              />
                            </div>
                            {userNavigation.map((item) => (
                              <Menu.Item key={item.name}>
                                {({ active }) => (
                                  <Link
                                    to={item.href}
                                    className={classNames(
                                      active ? 'bg-gray-100' : '',
                                      'block px-4 py-2 text-sm text-gray-700'
                                    )}
                                  >
                                    {item.name}
                                  </Link>
                                )}
                              </Menu.Item>
                            ))}
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </div>
                  <div className='-mr-2 flex items-center sm:hidden'>
                    {/* Mobile menu button */}
                    <Disclosure.Button
                      key='nav-menu-mobile'
                      className='bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'
                    >
                      <span className='sr-only'>Open main menu</span>
                      {open ? (
                        <XIcon className='block h-6 w-6' aria-hidden='true' />
                      ) : (
                        <MenuIcon
                          className='block h-6 w-6'
                          aria-hidden='true'
                        />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>

              <Disclosure.Panel key='nav-panel' className='sm:hidden'>
                <div className='pt-2 pb-3 space-y-1 border'>
                  {menuMap.map((item) => {
                    return (
                      <Disclosure.Button
                        key={`button-${item.path}`}
                        className='block pl-3 py-1 w-screen text-left items-stretch'
                      >
                        <NavLink
                          end={['', '/'].includes(item.path)}
                          key={`navlink-${item.path}`}
                          to={joinPaths(item.basename, item.path)}
                          className={({ isActive }) => {
                            return classNames(
                              isActive
                                ? 'bg-gray-100 border-gray-500 text-gray-700 text-2xl'
                                : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800',
                              'pl-3 py-2 border-l-4 text-base font-medium'
                            )
                          }}
                        >
                          <span className=''>{item.title}</span>
                        </NavLink>
                      </Disclosure.Button>
                    )
                  })}
                </div>
                <div className='pt-4 pb-3 border-t border-gray-200'>
                  <div className='flex items-center px-4'>
                    <div className='flex-shrink-0'>{user.avatar}</div>
                    <div className='ml-3'>
                      <div className='text-base font-medium text-gray-800'>
                        {user.name}
                      </div>
                      <div className='text-sm font-medium text-gray-500'>
                        {user.email}
                      </div>
                    </div>
                    <button
                      type='button'
                      className='ml-auto bg-white flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'
                    >
                      <span className='sr-only'>View notifications</span>
                      {/* <BellIcon className='h-6 w-6' aria-hidden='true' /> */}
                    </button>
                  </div>
                  <div className='mt-3 space-y-1'>
                    <div className='px-4 py-2 text-sm text-gray-700'>
                      <LanguageSelect
                        lang={lang}
                        onChangeLanguage={onChangeLanguage}
                      />
                    </div>
                    {userNavigation.map((item) => (
                      <Disclosure.Button
                        key={`user-button-${item.name}`}
                        className='block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                      >
                        <Link key={`user-menu-${item.name}`} to={item.href}>
                          {item.name}
                        </Link>
                      </Disclosure.Button>
                    ))}
                  </div>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        {children}
      </div>
    </>
  )
}

AppFrame.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]).isRequired,
}
