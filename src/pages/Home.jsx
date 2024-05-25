import { useNavigatePlus } from '@gatherwise/common-frontend-libs/components/LinkPlus'
import { withAuthenticatedUserLoader } from '@gatherwise/common-frontend-libs/libs/authentication'
import { useLoaderData } from '@gatherwise/common-frontend-libs/libs/router'
import Loading from '@gatherwise/common-frontend-libs/pages/Loading'
import { switchToPathFrom } from '@gatherwise/common-frontend-libs/pages/SwitchTo'
import { getCompanyService } from '@gatherwise/common-frontend-libs/services/endpoints/companies'
import { useEffect } from 'react'

export const loader = withAuthenticatedUserLoader(async ({ authenticatedUser }) => {
  const companies = await getCompanyService().readAll(/*{ fields: ['_id'] }*/) // TODO fields when fixed in backend
  return { authenticatedUser, companies }
})

export function Component() {
  const { companies } = useLoaderData()
  const navigatePlus = useNavigatePlus()

  useEffect(() => {
    navigatePlus(switchToPathFrom(companies))
  }, [])

  return (
    <div className=''>
      <Loading />
    </div>
  )
}
