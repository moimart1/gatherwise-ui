import DangerButton from '@gatherwise/common-frontend-libs/components/materials/Button/DangerButton'
import PrimaryButton from '@gatherwise/common-frontend-libs/components/materials/Button/PrimaryButton'
import SecondaryButton from '@gatherwise/common-frontend-libs/components/materials/Button/SecondaryButton'
import { H1, H2 } from '@gatherwise/common-frontend-libs/components/materials/Formatting'
import Input from '@gatherwise/common-frontend-libs/components/materials/Input'
import { withAuthenticatedUserLoader } from '@gatherwise/common-frontend-libs/libs/authentication'
import { Action, Subject } from '@gatherwise/common-frontend-libs/libs/authorization'
import { subject } from '@gatherwise/common-frontend-libs/libs/authorization/casl-ability'
import { browserTimeZone } from '@gatherwise/common-frontend-libs/libs/datetime'
import { humanError } from '@gatherwise/common-frontend-libs/libs/error'
import { useFormData } from '@gatherwise/common-frontend-libs/libs/form'
import { useLocalize } from '@gatherwise/common-frontend-libs/libs/localization'
import { useLoaderData, useNavigate } from '@gatherwise/common-frontend-libs/libs/router'
import { companyPath } from '@gatherwise/common-frontend-libs/libs/urls'
import { useDynamicHeader } from '@gatherwise/common-frontend-libs/providers/DynamicHeaderProvider'
import { useLoadingContext } from '@gatherwise/common-frontend-libs/providers/LoadingProvider'
import { useSnackBar } from '@gatherwise/common-frontend-libs/providers/SnackBarProvider'
import { getCompanyService, useCompanyService } from '@gatherwise/common-frontend-libs/services/endpoints/companies'
import CompanyForm from '../components/CompanyForm'

export const loader = withAuthenticatedUserLoader(async ({ authenticatedUser, params }) => {
  const company = await getCompanyService().read(params.companyId, { includeCount: true })
  return { authenticatedUser, company }
})

export const dynamicHeaderConfig = {
  placeholder: 'settings',
  menuMap: [
    {
      key: 'general',
      path: `${companyPath(':companyId')}/settings`,
      exactPath: true,
    },
    {
      key: 'expert information',
      path: `${companyPath(':companyId')}/settings/expert-info`,
    },
    {
      key: 'infrastructure',
      path: `${companyPath(':companyId')}/settings/infrastructure`,
      ability: { action: Action.UpgradeInfrastructure, subject: Subject.Company },
    },
  ],
}

export function Component() {
  const localize = useLocalize()
  const { company, authenticatedUser } = useLoaderData()
  const { formData, setFormData, handleChange } = useFormData(company)
  const snackbar = useSnackBar()
  const companyService = useCompanyService()
  const navigate = useNavigate()
  const suggestedTimeZone = browserTimeZone()

  useDynamicHeader({
    ...dynamicHeaderConfig,
    placeholder: localize(dynamicHeaderConfig.placeholder),
    actionComponents: [
      () => {
        const { isLoading } = useLoadingContext()
        return (
          <PrimaryButton type='submit' form='settings-form' disabled={isLoading}>
            {localize('save')}
          </PrimaryButton>
        )
      },
    ],
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const { displayName, slugName, subscription, timezone } = formData
    companyService
      .update(company?._id, {
        displayName,
        slugName,
        subscription,
        timezone,
      })
      .then(() => {
        if (companyService.error) {
          snackbar.error(humanError(companyService.error), { localize })
          return
        }

        snackbar.success(`${localize('settings')} ${localize('updated')}`)
      })
  }

  return (
    <div className='flex flex-col space-y-4'>
      <H1 className='py-3'>{localize('general company')}</H1>
      <p>{localize('update settings about your company')}</p>
      <form id='settings-form' className='flex flex-col space-y-4 md:w-1/2 md:px-6' onSubmit={handleSubmit}>
        <CompanyForm formData={formData} handleChange={handleChange} disabled={companyService.loading} />
        {/* Timezone */}
        <div className='flex flex-col space-y-2'>
          <label id={'timezone-label'} className={'block'} htmlFor='timezone-label'>
            <H2>{localize('timezone')}</H2>
          </label>
          <div className='flex w-full flex-row items-center space-x-2'>
            <Input
              id='timezone-label'
              name='timezone'
              type='text'
              value={formData?.timezone}
              onChange={handleChange}
              disabled={companyService.loading}
              className={'w-full'}
            />
            <SecondaryButton
              className={'h-10 text-nowrap'}
              onClick={(e) => {
                e.preventDefault()
                setFormData((previous) => ({ ...previous, timezone: suggestedTimeZone }))
              }}
            >
              {`${localize('use')} "${suggestedTimeZone}"`}
            </SecondaryButton>
          </div>
        </div>
      </form>
      {authenticatedUser.can(Action.Delete, subject(Subject.Company, company)) && (
        <div className={'space-y-3'}>
          <H1>{localize('delete company')}</H1>
          <p>{localize('This operation is irreversible')}</p>
          <DangerButton
            onClick={() => {
              if (confirm('Do you really want to delete this company?')) {
                companyService.delete(company._id).then(() => navigate('/'))
              }
            }}
          >
            {localize('delete company')}
          </DangerButton>
        </div>
      )}
    </div>
  )
}
