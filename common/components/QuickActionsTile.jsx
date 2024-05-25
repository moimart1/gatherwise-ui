import { faChevronRight } from '@fortawesome/pro-light-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { classNames } from '../libs/style'
import Icon from './Icon'
import LinkPlus from './LinkPlus'

/**
 * @typedef {Object} TileAction
 * @property {string} TileAction.title Title of the action
 * @property {string} TileAction.titleClassName Class name for the title
 * @property {string} TileAction.note Note under the title
 * @property {string} TileAction.href Link of the action
 * @param {Object} options
 * @param {string} options.className Class names
 * @param {string} options.title Main title
 * @param {import('@fortawesome/pro-light-svg-icons').IconDefinition} options.icon Main icon
 * @param {TileAction} options.primaryAction Primary action for the tile
 * @param {TileAction[]} options.secondaryActions List of secondary actions for the tile
 * @param {{title:string, value:number}[]} options.stats Show stats
 * @returns {JSX.Element}
 */
export default function QuickActionsTile({ icon, className, title, primaryAction, secondaryActions, stats }) {
  return (
    <div className={className}>
      <div className='h-full w-full space-y-6 rounded border px-4 py-4'>
        <span className='flex flex-row items-center space-x-3 text-midnight'>
          <Icon className={'h-6 w-6 items-center fill-midnight text-midnight'} look={icon} />
          <span className={'text-xl font-bold'}>{title}</span>
          {primaryAction && <span className={'grow text-center text-midnight-500'}>{primaryAction.title}</span>}
        </span>
        <div className='flex flex-row space-x-6'>
          {Array.isArray(stats) &&
            stats.map((stat) => {
              return (
                <div key={stat.title} className='flex flex-col'>
                  <span className={'text-sm text-midnight-500'}>{stat.title}</span>
                  <span className={'text-center text-lg'}>
                    {typeof stat?.value === 'number' && !Number.isNaN(stat.value) ? stat.value : '-'}
                  </span>
                </div>
              )
            })}
        </div>
        <div className='flex'>
          <div className='flex flex-col'>
            <div className='flex flex-col space-y-1 text-sm'>
              {Array.isArray(secondaryActions) &&
                secondaryActions.map((action) => {
                  return (
                    <span
                      key={action.title}
                      className={classNames('flex flex-row items-center space-x-2', action.note ? 'py-0' : 'py-1')}
                    >
                      <FontAwesomeIcon icon={faChevronRight} color='#001B44' />
                      <span className='flex flex-col -space-y-1'>
                        <LinkPlus className={action.titleClassName} to={action.href ?? ''}>
                          {action.title}
                        </LinkPlus>
                        {action.note && <span className='text-xs text-midnight-500'>{action.note}</span>}
                      </span>
                    </span>
                  )
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
