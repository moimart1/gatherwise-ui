import { faGrid } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import useClickOutside from '../hooks/useClickOutside'
import { useLocalize } from '../libs/localization'
import { servicesInformationFromCompany } from '../libs/services'
import { companyBasenamePath } from '../libs/urls'
import { switchToPath } from '../pages/SwitchTo'
import LinkPlus from './LinkPlus'

export default function SwitchToMenu({ company }) {
  const [showMenu, setShowMenu] = useState(false)
  const ref = useClickOutside(() => setShowMenu(false))
  const localize = useLocalize()
  const services = servicesInformationFromCompany(company)
  const switchToLink = `${companyBasenamePath()}${switchToPath}`
  const navigate = useNavigate()

  return (
    <div className='h-full'>
      <button
        ref={ref}
        className='h-full'
        type='button'
        onClick={() => {
          if (services.length > 0) {
            setShowMenu((prev) => !prev)
          } else {
            navigate(switchToLink)
          }
        }}
      >
        <FontAwesomeIcon className='h-full w-full' icon={faGrid} />
      </button>
      {/* Menu */}
      {showMenu && (
        <div className={`relative left-0 top-0 z-30 w-44 divide-y divide-midnight-100 rounded bg-white shadow`}>
          <ul className='py-1 text-sm'>
            {services.map((service) => {
              return (
                <li key={service.name}>
                  <LinkPlus to={service.url} className='flex flex-row px-2 py-2 hover:bg-midnight-100'>
                    <FontAwesomeIcon icon={service.icon} className={'mx-2 h-5'} color={'#001B44'} /* midnight */ />
                    {service.name}
                  </LinkPlus>
                </li>
              )
            })}
          </ul>
          <div className='py-1'>
            <NavLink className={'block px-4 py-2 hover:bg-midnight-100'} to={switchToLink}>
              {localize('switch to') + '...'}
            </NavLink>
          </div>
        </div>
      )}
    </div>
  )
}
