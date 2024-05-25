import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useRef, useState } from 'react'
import { useLoaderData, useNavigate, useSearchParams } from 'react-router-dom'
import Carrousel from '../components/Carrousel'
import LinkPlus, { useNavigatePlus } from '../components/LinkPlus'
import SearchBar, { filterSearchTags } from '../components/SearchBar'
import Spinner from '../components/Spinner'
import ThreeDotButton from '../components/materials/Button/ThreeDotButton'
import useCompanyJoinActions from '../hooks/useCompanyJoinActions'
import { withAuthenticatedUserLoader } from '../libs/authentication'
import { serviceEnum } from '../libs/constants'
import { KeyEnum } from '../libs/keyboard'
import { useLocalize } from '../libs/localization'
import { servicesInformationFromCompany } from '../libs/services'
import { companyPath, getServiceOrigin } from '../libs/urls'
import { getCompanyService } from '../services/endpoints/companies'

function Tile({ company, active, loading, actions, onClick, to = '' }) {
  const localize = useLocalize()
  const divRef = useRef()
  const navigatePlus = useNavigatePlus()
  const title = company.displayName
  const subTitleRef = useRef(
    company?.parent?.displayName ? `${localize('managed by')} ${company.parent.displayName}` : localize('root company')
  )
  const [subTitle, setSubtitle] = useState(subTitleRef.current)

  useEffect(() => {
    setSubtitle(loading ? 'joining company...' : subTitleRef.current)
  }, [loading])

  useEffect(() => {
    if (active) {
      // Get the focus on the current tile to have onKeyDown working
      divRef.current.focus()
    }
  }, [active])

  return (
    <div
      ref={divRef}
      tabIndex={0} // Needed to have onKeyDown working
      className={`w-60 shrink-0 rounded-lg border px-2 py-4 text-center focus:outline-none focus:ring-0 ${active ? 'border-midnight-500 bg-midnight-50' : ''}`}
      onKeyDown={(e) => {
        if (active && e.key === KeyEnum.Enter) {
          // on active and press enter
          if (typeof onClick === 'function') onClick(e)
          else navigatePlus(to)
        }
      }}
    >
      <div className='flex flex-row items-center px-1'>
        <div>{loading && <Spinner className={'m-auto h-8 w-8 animate-spin fill-midnight text-midnight-100'} />}</div>
        <div className='w-full truncate px-1'>
          <h3 className='cursor-pointer truncate text-center text-2xl font-semibold' onClick={onClick} title={title}>
            {typeof onClick === 'function' ?
              title
            : <LinkPlus className={'text-midnight'} to={to}>
                {title}
              </LinkPlus>
            }
          </h3>
          <h4 className='min-h-[16px] truncate text-center text-xs text-midnight-500' title={subTitle}>
            {subTitle}
          </h4>
        </div>
        <div className='relative'>
          {Array.isArray(actions) && actions.length > 0 && (
            <ThreeDotButton className={'text-2xl'} itemsClassName={'px-1 py-1'}>
              {actions.map(({ key, title, onClick, icon, to }) => {
                return (
                  <ThreeDotButton.MenuItem key={key} className={'flex flex-row items-center space-x-2 text-nowrap px-4 py-2'}>
                    {icon && <FontAwesomeIcon icon={icon} />}
                    {typeof onClick === 'function' ?
                      <span onClick={onClick}>{title}</span>
                    : <LinkPlus to={to}>{title}</LinkPlus>}
                  </ThreeDotButton.MenuItem>
                )
              })}
            </ThreeDotButton>
          )}
        </div>
      </div>
    </div>
  )
}

export const switchToPath = '/switch-to'

export function switchToPathFrom(companies) {
  let path = '/'
  if (Array.isArray(companies) && companies.length === 0) {
    path = `${getServiceOrigin(serviceEnum.admin)}/new`
  } else if (Array.isArray(companies) && companies.length > 1) {
    // If more than one company, need to select one in "Switch to" page
    path = switchToPath
  } else if (Array.isArray(companies) && companies.length === 1) {
    // If one company, go to "Company space"
    path = `${companyPath(companies[0]._id)}`
  }

  return path
}

export const loader = withAuthenticatedUserLoader(async ({ authenticatedUser }) => {
  const allCompanies = await getCompanyService({
    accessToken: authenticatedUser.accessToken,
  }).readAll({ includeJoinable: true }) // TODO fields
  return { authenticatedUser, allCompanies }
})

export function Component() {
  const { allCompanies } = useLoaderData()
  return <SwitchTo allCompanies={allCompanies} />
}

export default function SwitchTo({ allCompanies, onClick }) {
  const [companies, setCompanies] = useState([])
  const [otherCompanies, setOtherCompanies] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const localize = useLocalize()
  const searchRef = useRef()
  const [searchParams] = useSearchParams({ service: '' })
  const navigatePlus = useNavigatePlus()

  useEffect(() => {
    const to = switchToPathFrom(allCompanies)
    if (to !== switchToPath) {
      // Not on the good page
      return navigatePlus(to)
    }

    // Filter companies based on search query
    setCompanies(
      filterSearchTags(
        allCompanies.filter((company) => company.joined),
        searchQuery,
        (company) => [company._id, company.slugName, company.displayName]
      )
    )
    setOtherCompanies(
      filterSearchTags(
        allCompanies.filter((company) => !company.joined),
        searchQuery,
        (company) => [company._id, company.slugName, company.displayName]
      )
    )
  }, [allCompanies, searchQuery])

  const matrix = [[null /* represent the root state: search bar */], companies, otherCompanies].filter((row) => row?.length > 0)
  const [cursor, setCursor] = useState({ x: 0, y: 0, selected: null })
  const maxY = matrix.length - 1
  const maxX = matrix?.[cursor.y]?.length > 0 ? matrix[cursor.y].length - 1 : 0

  const cursorFrom = ({ x, y }) => {
    const selected = matrix?.[y]?.[x] ?? {}
    return { x, y, selected }
  }

  const onPress = ({ key }) => {
    switch (key) {
      case KeyEnum.ArrowDown:
        setCursor((prev) =>
          cursorFrom({
            x: Math.min(maxX, prev.x),
            y: Math.min(maxY, prev.y + 1),
          })
        )
        break
      case KeyEnum.ArrowUp:
        setCursor((prev) => cursorFrom({ x: Math.max(0, prev.x), y: Math.max(0, prev.y - 1) }))
        break
      case KeyEnum.ArrowLeft:
        setCursor((prev) => cursorFrom({ x: Math.max(0, prev.x - 1), y: Math.max(0, prev.y) }))
        break
      case KeyEnum.ArrowRight:
        setCursor((prev) =>
          cursorFrom({
            x: Math.min(maxX, prev.x + 1),
            y: Math.min(maxY, prev.y),
          })
        )
        break
      default:
        break
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', onPress)
    if (cursor.x === 0 && cursor.y === 0) {
      searchRef.current?.focus()
    }

    return () => {
      window.removeEventListener('keydown', onPress)
    }
  }, [companies, otherCompanies, cursor])

  return (
    <div className='px-1'>
      <div className={'mx-auto w-3/4 py-3 sm:w-1/2 lg:w-1/3'}>
        <SearchBar ref={searchRef} searchQuery={searchQuery} onSearchQuery={setSearchQuery} />
      </div>

      <div className='mx-auto px-1 text-center sm:px-2'></div>

      <Carrousel title={localize('companies')} scrollStep={100}>
        {Array.isArray(companies) &&
          companies.map((company) => {
            const services = servicesInformationFromCompany(company)

            return (
              <Tile
                key={company._id}
                active={cursor.selected?._id === company._id}
                company={company}
                onClick={onClick ? () => onClick(company) : undefined}
                to={`${getServiceOrigin(searchParams.get('service'))}${companyPath(company._id)}`}
                actions={services.map((service) => {
                  return {
                    key: service.name,
                    title: service.name,
                    icon: service.icon,
                    to: service.url,
                  }
                })}
              />
            )
          })}
      </Carrousel>
      {Array.isArray(otherCompanies) && otherCompanies.length > 0 && (
        <Carrousel title={localize('other companies')} scrollStep={100}>
          {otherCompanies.map((company) => (
            <OtherCompany
              active={cursor.selected?._id === company._id}
              key={company._id}
              company={company}
              searchQuery={searchQuery}
            />
          ))}
        </Carrousel>
      )}
    </div>
  )
}
function OtherCompany({ company, active }) {
  const navigate = useNavigate()
  const { actions, loading } = useCompanyJoinActions({
    company,
    onUpdate: () => {
      navigate(companyPath(company._id))
    },
  })

  return (
    <Tile
      active={active}
      loading={loading}
      company={company}
      onClick={actions?.[0]?.onClick}
      actions={actions?.slice(1)?.map(({ key, text, onClick }) => ({ key, onClick, title: text }))}
    />
  )
}
