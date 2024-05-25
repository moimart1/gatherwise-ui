import { DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { useMemo, useRef } from 'react'
import { NavLink, generatePath, useParams } from 'react-router-dom'
import { useLocalize } from '../libs/localization'
import { classNames } from '../libs/style'
import { useAuthenticatedUser } from '../providers/AuthenticatedUserProvider'

/**
 * @typedef {Object} MenuItemMap
 * @property {string} MenuItemMap.key Key of the item in the menu
 * @property {string} MenuItemMap.path Path pattern where the item of the menu is active
 * @property {boolean} MenuItemMap.exactPath Match exact path to be active
 * @property {{ action: keyof Action, subject: keyof Subject}} MenuItemMap.ability Special ability action and subject
 */

/**
 * @typedef {Object} NavBarItem
 * @property {string} MenuItemMap.key Key of the item in the menu
 * @property {string} MenuItemMap.path Path where the item of the menu is active
 * @property {boolean} MenuItemMap.isHidden Should not show the item
 * @property {boolean} MenuItemMap.exactPath Is an exact path, don't match nested path
 */

/**
 * Transform menu map config to nav bar items
 * @param {MenuItemMap[]} menuMap
 * @returns {NavBarItem[]}
 */
export function useNavBarItems(menuMap) {
  const authenticatedUser = useAuthenticatedUser()
  const params = useParams()
  const paramsRef = useRef({})

  return useMemo(() => {
    // Workaround to fix when switching routes with less parameters, need to keep all params to avoid an error
    // Because generatePath() is called even if the path is not the current path
    paramsRef.current = { ...paramsRef.current, ...params }

    return menuMap.reduce((acc, item) => {
      const result = {
        key: item.key,
        path: generatePath(item.path, paramsRef.current),
        isHidden: true,
        exactPath: false,
      }

      result.exactPath = ['', '/'].includes(result.path) || item?.exactPath === true
      if (!item.ability) {
        // No special ability for this item
        result.isHidden = false
      } else if (authenticatedUser?.can(item.ability.action, item.ability.subject)) {
        // Have ability to see this item
        result.isHidden = false
      }

      acc.push(result)
      return acc
    }, [])
  }, [menuMap, authenticatedUser, params]) // params is important when switch between companies
}

/**
 * @param {Object} options
 * @param {string} options.className style
 * @param {NavBarItem[]} options.items
 * @returns
 */
export default function NavBar({ className, items }) {
  const localize = useLocalize()

  return (
    <div className={className}>
      {Array.isArray(items) &&
        items.map(({ key, path, isHidden, exactPath }) => {
          return (
            <NavLink
              key={path}
              end={exactPath}
              to={path}
              className={({ isActive }) => {
                return classNames(
                  isActive ? 'border-midnight-950 text-midnight' : 'border-transparent hover:border-midnight-700',
                  isHidden && 'hidden',
                  'text-1xl inline-flex items-center border-b-2 px-1 pt-1'
                )
              }}
            >
              <span className='whitespace-nowrap text-nowrap'>{typeof key === 'string' ? localize(key) : key}</span>
            </NavLink>
          )
        })}
    </div>
  )
}

/**
 * @param {Object} options
 * @param {string} options.className style
 * @param {NavBarItem[]} options.items
 * @returns
 */
export function MobileNavBar({ className, items }) {
  const localize = useLocalize()

  return (
    <DisclosurePanel key='nav-panel' className={className}>
      {Array.isArray(items) && (
        <div className='space-y-1 border-y border-midnight-100 pb-3 pt-2'>
          {items.map(({ key, path, isHidden, exactPath }) => {
            return (
              <DisclosureButton key={`button-${path}`} className='w-full px-3 text-left'>
                <NavLink
                  end={exactPath}
                  key={path}
                  to={path}
                  className={({ isActive }) => {
                    return classNames(
                      isActive ? 'border-midnight bg-midnight-100 text-2xl' : 'border-transparent',
                      isHidden && 'hidden',
                      'flex border-l-4 py-1 pl-3 text-base font-medium'
                    )
                  }}
                >
                  <span className=''>{localize(key)}</span>
                </NavLink>
              </DisclosureButton>
            )
          })}
        </div>
      )}
    </DisclosurePanel>
  )
}
