import QuickActionsTile from '@gatherwise/common-frontend-libs/components/QuickActionsTile'
import { H1, H2, P } from '@gatherwise/common-frontend-libs/components/materials/Formatting'
import { withAuthenticatedUserLoader } from '@gatherwise/common-frontend-libs/libs/authentication'
import { Action, Subject } from '@gatherwise/common-frontend-libs/libs/authorization'
import { serviceEnum } from '@gatherwise/common-frontend-libs/libs/constants'
import { useLocalize } from '@gatherwise/common-frontend-libs/libs/localization'
import { useLoaderData } from '@gatherwise/common-frontend-libs/libs/router'
import { companyPath, getServiceOrigin } from '@gatherwise/common-frontend-libs/libs/urls'
import { useDynamicHeader } from '@gatherwise/common-frontend-libs/providers/DynamicHeaderProvider'
import { getCompanyService } from '@gatherwise/common-frontend-libs/services/endpoints/companies'
import { getUserService } from '@gatherwise/common-frontend-libs/services/endpoints/users'
import { MachineAdminState } from '../libs/constants'
import { getMachineService } from '../services/endpoints/machines'

export const loader = withAuthenticatedUserLoader(async ({ params, authenticatedUser }) => {
  const company = await getCompanyService().read(params.companyId)
  const usersCount =
    authenticatedUser.can(Action.ReadAllFromCompany, Subject.User) ?
      await getUserService().count({ companyId: params.companyId })
    : []
  const machinesCount =
    authenticatedUser.can(Action.ReadAll, Subject.Machine) ? await getMachineService().count({ companyId: params.companyId }) : []

  return { authenticatedUser, company, usersCount, machinesCount }
})

export function Component() {
  const localize = useLocalize()
  const { company, usersCount, machinesCount, authenticatedUser } = useLoaderData()
  const noMachines = machinesCount.total === 0

  useDynamicHeader({
    placeholder: localize('overview'),
  })

  return (
    <div className='m-auto flex flex-col space-y-6'>
      <span className='space-y-3'>
        <H1>{localize('administration')}</H1>
        <P>{localize('manage users, billing, global settings, and more for all the services in your company.')}</P>
      </span>
      <H2>{localize('quick actions')}</H2>
      {authenticatedUser.isCompanySubscriptionExpired && (
        <span className='text-red-500'>{localize('your subscription is expired')}</span>
      )}
      <div className='flex flex-row flex-wrap justify-center gap-6'>
        {authenticatedUser.can(Action.ReadAll, Subject.Machine) && (
          <QuickActionsTile
            className='w-72'
            icon={'fa-solid fa-router'}
            title={localize('machines')}
            secondaryActions={[
              {
                title: localize('add a new machine'),
                href: `${getServiceOrigin(serviceEnum.edge)}${companyPath(company?._id)}/workstations/new`,
                note: noMachines ? localize('suggested next step') : '',
              },
              {
                title: localize('show the list of machine'),
                href: `${getServiceOrigin(serviceEnum.edge)}${companyPath(company?._id)}/workstations`,
              },
            ]}
            stats={[
              { title: localize('total'), value: machinesCount.total ?? -1 },
              {
                title: localize('active'),
                // billable is deprecated, remove it when migrated
                value:
                  (typeof machinesCount?.[MachineAdminState.Billable] === 'number' ?
                    machinesCount[MachineAdminState.Billable]
                  : 0) + machinesCount[MachineAdminState.Activated],
              },
            ]}
          />
        )}
        {authenticatedUser.can(Action.ReadAll, Subject.Machine) && (
          <QuickActionsTile
            className='w-72'
            icon={'fa-solid fa-chart-bar'}
            title={localize('app')}
            secondaryActions={[
              {
                title: localize('see the dashboard'),
                titleClassName: noMachines ? 'line-through' : '',
                note: noMachines ? localize('add machines to see realtime information') : '',
                href: `${getServiceOrigin(serviceEnum.webapp)}${companyPath(company?._id)}/dashboard`,
              },
              {
                title: localize('create a new program'),
                href: `${getServiceOrigin(serviceEnum.webapp)}${companyPath(company?._id)}/programs/create`,
              },
              {
                title: localize('create a new planing'),
                href: `${getServiceOrigin(serviceEnum.webapp)}${companyPath(company?._id)}/planning`,
              },
            ]}
            stats={[]}
          />
        )}
        {authenticatedUser.can(Action.ReadAllFromCompany, Subject.User) && (
          <QuickActionsTile
            className='w-72 bg-midnight-50'
            icon={'fa-solid fa-user'}
            title={localize('users')}
            secondaryActions={[
              {
                title: localize('add a new user'),
                href: `${companyPath(company?._id)}/users/new`,
              },
              { title: localize('show the list of user'), href: `${companyPath(company?._id)}/users` },
            ]}
            stats={[{ title: localize('total'), value: usersCount.total }]}
          />
        )}
        <QuickActionsTile
          className='w-72 bg-midnight-50'
          icon={'fa-solid fa-gear'}
          title={localize('settings')}
          secondaryActions={[
            { title: localize('update company name'), href: `${companyPath(company?._id)}/settings` },
            { title: localize('change your subscription plan'), href: `${companyPath(company?._id)}/settings` },
            { title: localize('show expert information'), href: `${companyPath(company?._id)}/settings/expert-info` },
          ]}
          stats={[]}
        />
      </div>
    </div>
  )
}
