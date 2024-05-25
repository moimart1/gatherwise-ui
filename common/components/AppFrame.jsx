import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from '@headlessui/react'
import PropTypes from 'prop-types'
import { Fragment } from 'react'
import { NavLink } from 'react-router-dom'
import { baseUrlGlobalRealm } from '../libs/constants'
import { useLocalize } from '../libs/localization'
import { classNames } from '../libs/style'
import { companyBasenamePath } from '../libs/urls'
import { useAuthenticatedUser } from '../providers/AuthenticatedUserProvider'
import { useLoadingContext } from '../providers/LoadingProvider'
import AppBody from './AppBody'
import AuthButton from './AuthButton'
import Avatar from './Avatar'
import LanguageSelect from './LanguageSelect'
import LinkPlus from './LinkPlus'
import LoadingBar from './LoadingBar'
import NavBar, { MobileNavBar, useNavBarItems } from './NavBar'
import SwitchToMenu from './SwitchToMenu'

/**
 * @typedef {Object} SitePreferences
 * @property {string} sitePreferences.title Title of the current Next-gen frontend (e.g Admin, Edge, ...)
 * @property {string} sitePreferences.logo Logo to show in the header
 * @param {{children: JSX.Element, sitePreferences: SitePreferences, menuMap: import('./NavBar').MenuItemMap[]}}
 */
export default function AppFrame({ children, sitePreferences, menuMap }) {
  const authenticatedUser = useAuthenticatedUser()
  const navBarItems = useNavBarItems(menuMap)
  const localize = useLocalize()
  const { isLoading } = useLoadingContext()

  const currentCompany = authenticatedUser?.currentCompany
  const avatar = (
    <Avatar
      {...{
        name: authenticatedUser?.fullName,
        className: 'h-9 w-9 font-bold font-sans bg-midnight-500 rounded-full text-white',
      }}
    />
  )

  const userNavigation = [
    {
      name: 'Profile',
      href: `${baseUrlGlobalRealm}/account/#/personal-info`,
    }, //  NOTE view token
    { name: 'Settings', href: '/settings' }, //  NOTE view token

    { name: <AuthButton />, href: '' }, // NOTE logout
  ]

  document.title = `${sitePreferences?.title} ${currentCompany?.displayName ? `for ${currentCompany.displayName}` : ''} - Gatherwise`
  return (
    <>
      <div className={'fixed left-0 top-0 z-100 h-2 w-full'}>
        <LoadingBar enabled={isLoading} className={'h-1 bg-midnight-500'} />
      </div>
      <div className='min-h-full w-full'>
        <Disclosure
          key='menu'
          {...{
            as: 'nav',
            className: 'bg-midnight-50 border-b border-midnight-100',
          }}
        >
          {({ open }) => (
            <>
              <div className='px-4 sm:px-2 md:px-6 lg:px-8'>
                <div className='flex h-12 justify-between'>
                  <div className='flex items-center space-x-4 sm:space-x-2 md:space-x-6 lg:space-x-8'>
                    <div className='h-6 w-6 text-midnight'>
                      <SwitchToMenu company={currentCompany} />
                    </div>
                    <div className='flex flex-shrink-0 items-center'>
                      <NavLink to={`${companyBasenamePath()}`} className={'flex flex-row items-center space-x-1'}>
                        <img className='h-8 w-auto' src={sitePreferences.logo} alt='logo' />
                        <div className='h-4 w-0 border-l'></div>
                        <div className='pointer-events-none text-right font-narrow text-sm uppercase text-midnight-500 drop-shadow-sm'>
                          {sitePreferences?.title}
                        </div>
                      </NavLink>
                    </div>
                    {/* Desktop navbar */}
                    <NavBar items={navBarItems} className={'hidden text-midnight-800 sm:flex sm:space-x-1 lg:space-x-3'} />
                  </div>
                  <div className='flex flex-row items-center'>
                    <div className='hidden sm:ml-6 sm:flex sm:items-center'>
                      <div className='w-30 ml-3 px-1 text-right'>
                        <div className='text-md hidden truncate text-clip text-right font-narrow text-midnight-500 md:flex'>
                          {currentCompany?.displayName ?? ''}
                        </div>
                      </div>
                      {/* Profile dropdown */}
                      <Menu as='div' className='relative ml-3'>
                        <div>
                          <MenuButton className='flex text-sm '>
                            <span className='sr-only'>Open user menu</span>
                            {avatar}
                          </MenuButton>
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
                          <MenuItems className='absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                            <div className='px-2 pt-2 text-center'>{authenticatedUser?.fullName}</div>
                            <div className='text-center text-sm text-midnight-500'>
                              <span className='truncate'>{`${currentCompany?.displayName} `}</span>
                              {currentCompany?.subscription && (
                                <span className='text-xs italic'>{`(${localize(currentCompany.subscription)})`}</span>
                              )}
                            </div>
                            <div className='px-4 py-2 text-sm text-midnight-500'>
                              <LanguageSelect />
                            </div>
                            {userNavigation.map((item) => (
                              <MenuItem key={item.name}>
                                {({ focus }) => {
                                  const className = 'block px-4 py-2 text-sm'
                                  if (item?.href) {
                                    return (
                                      <LinkPlus to={item.href} className={classNames(focus ? 'bg-midnight-100' : '', className)}>
                                        {item.name}
                                      </LinkPlus>
                                    )
                                  }

                                  return <span className={className}>{item.name}</span>
                                }}
                              </MenuItem>
                            ))}
                          </MenuItems>
                        </Transition>
                      </Menu>
                    </div>
                  </div>
                  <div className='-mr-2 flex items-center sm:hidden'>
                    {/* Mobile menu button */}
                    <DisclosureButton
                      key='nav-menu-mobile'
                      className='inline-flex items-center justify-center rounded-md border bg-white p-2 focus:outline-none focus:ring-0'
                    >
                      <span className='sr-only'>Open main menu</span>
                      {open ?
                        <FontAwesomeIcon icon={'fa-solid fa-xmark'} />
                      : <FontAwesomeIcon icon={'fa-solid fa-bars'} />}
                    </DisclosureButton>
                  </div>
                </div>
              </div>

              <MobileNavBar items={navBarItems} className='border-t border-midnight-100 sm:hidden' />
              <DisclosurePanel>
                <div className='pb-3 pt-4'>
                  <div className='flex items-center px-4'>
                    <div className='ml-3'>
                      <div className='text-base font-medium'>{authenticatedUser?.fullName}</div>
                      <div className='text-sm font-medium text-midnight-500'>
                        <span className='truncate'>{`${currentCompany?.displayName} `}</span>
                        <span className='text-xs italic'>{`(${localize(currentCompany.subscription)})`}</span>
                      </div>
                    </div>
                  </div>
                  <div className='mt-3 space-y-1'>
                    <div key='language-select' className='px-4 py-2'>
                      <LanguageSelect />
                    </div>
                    {userNavigation.map((item) => (
                      <DisclosureButton
                        key={`user-button-${item.name}`}
                        className='block px-4 py-2 text-base font-medium'
                        as='div'
                      >
                        {item?.href ?
                          <LinkPlus key={`user-menu-${item.name}`} to={item.href}>
                            {item.name}
                          </LinkPlus>
                        : item.name}
                      </DisclosureButton>
                    ))}
                  </div>
                </div>
              </DisclosurePanel>
            </>
          )}
        </Disclosure>

        <AppBody>{children}</AppBody>
      </div>
    </>
  )
}

AppFrame.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element]).isRequired,
}
