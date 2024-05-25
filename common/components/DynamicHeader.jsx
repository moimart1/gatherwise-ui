import React, { useContext, useMemo } from 'react'
import { useLocalize } from '../libs/localization'
import { classNames } from '../libs/style'
import { DynamicHeaderContext } from '../providers/DynamicHeaderProvider'
import NavBar, { useNavBarItems } from './NavBar'
import ThreeDotButton from './materials/Button/ThreeDotButton'

export default function DynamicHeader({ className }) {
  const localize = useLocalize()
  const { placeholder, menuMap, actionComponents } = useContext(DynamicHeaderContext)
  const ActionComponents = useMemo(() => {
    return Array.isArray(actionComponents) ?
        actionComponents.map((Action, i) => {
          if (typeof Action === 'object' && !Array.isArray(Action)) {
            // If it's a component directly
            return Action
          }

          return <Action className='flex' key={i} />
        })
      : []
  }, [actionComponents])

  if (!placeholder && !menuMap?.length && !actionComponents?.length) return <></> // Nothing to show
  return (
    <header className={className}>
      <div className='m-auto flex max-w-7xl flex-row px-2 py-2'>
        <div
          className={classNames(
            'px-4 sm:px-6 lg:px-8',
            menuMap?.length > 0 && actionComponents?.length > 0 ? 'hidden lg:flex' : menuMap.length > 0 && 'hidden sm:flex'
          )}
        >
          <h2 className='overflow-hidden truncate text-nowrap text-2xl font-bold leading-tight'>{localize(placeholder)}</h2>
        </div>
        <div className='items-center overflow-y-auto '>
          <SubNavBar menuMap={menuMap} />
        </div>
        <div className='flex-grow'></div>
        {/* Action components for desktop */}
        <div className='hidden flex-row items-center px-2 sm:flex sm:space-x-1 md:space-x-2 lg:space-x-4'>{ActionComponents}</div>
        {/* Action components for mobile */}
        <ThreeDotButton
          size='lg'
          className={classNames(
            'px-2',
            Array.isArray(actionComponents) && actionComponents.length > 0 ? 'block sm:hidden' : 'hidden'
          )}
          itemsClassName={'gap-2 flex flex-row items-center py-2 px-2 flex-wrap '}
        >
          {ActionComponents}
        </ThreeDotButton>
      </div>
    </header>
  )
}

function SubNavBar({ menuMap }) {
  const navBarItems = useNavBarItems(menuMap)

  return (
    <NavBar
      items={navBarItems}
      className={'flex flex-nowrap space-x-1 overflow-y-auto text-nowrap text-midnight-500 scrollbar-hide lg:space-x-3'}
    />
  )
}
