import Spinner from '@gatherwise/common-frontend-libs/components/Spinner'
import PrimaryButton from '@gatherwise/common-frontend-libs/components/materials/Button/PrimaryButton'
import { H1 } from '@gatherwise/common-frontend-libs/components/materials/Formatting'
import { withAuthenticatedUserLoader } from '@gatherwise/common-frontend-libs/libs/authentication'
import { browserTimeZone } from '@gatherwise/common-frontend-libs/libs/datetime'
import { humanError } from '@gatherwise/common-frontend-libs/libs/error'
import { useFormData } from '@gatherwise/common-frontend-libs/libs/form'
import { useLocalize } from '@gatherwise/common-frontend-libs/libs/localization'
import { useNavigate, useSearchParams } from '@gatherwise/common-frontend-libs/libs/router'
import { companyPath, decodeUrlObjectParams } from '@gatherwise/common-frontend-libs/libs/urls'
import { useCompanyService } from '@gatherwise/common-frontend-libs/services/endpoints/companies'
import React from 'react'
import { CompanyFormDisplayName, defaultCompanyData } from '../components/CompanyForm'

export const loader = withAuthenticatedUserLoader(async ({ authenticatedUser }) => {
  return { authenticatedUser }
})

export function Component() {
  const timezone = browserTimeZone()
  // Username used as honeypot
  const { formData, handleChange } = useFormData({ ...defaultCompanyData, timezone, username: '' })
  const localize = useLocalize()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  // parentId is the company that sent the invitation
  const { parentId } = decodeUrlObjectParams(searchParams.get('affiliate'))
  const companyService = useCompanyService()

  const handleSubmit = (e) => {
    e.preventDefault()
    const { displayName, timezone, username } = formData
    companyService
      .create({
        displayName,
        timezone,
        username, // Honey pot field
        parentId,
      })
      .then((company) => {
        navigate(companyPath(company._id)) // Redirect to company page
      })
  }

  return (
    <div className='space-y-6'>
      <div className='space-y-2'>
        <H1>{localize('create a new environment for the application')}</H1>
        <p className='px-4'>{localize('before you start, you need to create an environment with the company name')}</p>
      </div>
      {companyService.error && (
        <div className='bg-red-100 px-8 py-4 text-red-500'>{humanError(companyService.error, { localize })}</div>
      )}
      <div className='flex flex-row items-end space-x-2 pr-2 sm:space-x-8 sm:pr-8'>
        <CompanyFormDisplayName
          className={'flex w-full flex-col space-x-2 space-y-4 sm:space-x-8'}
          formData={formData}
          handleChange={handleChange}
          disabled={companyService.loading}
        />
        {/* HoneyPot Field  */}
        <div className='form-group username'>
          <label className='control-label' htmlFor='username'>
            &nbsp;
          </label>
          <input
            id='username'
            type='text'
            name='username'
            tabIndex='-1'
            value={formData?.username}
            onChange={handleChange}
            autoComplete='off'
          />
        </div>
        <PrimaryButton className={'h-10 px-4'} onClick={handleSubmit} disabled={companyService.loading}>
          {localize('save')}
        </PrimaryButton>
      </div>
      {companyService.loading && (
        <div className='space-y-8 text-center'>
          <span>
            <p>{localize('creation of the new environment with dedicated security keys') + '...'}</p>
            <p className='text-sm italic'>{`${localize('note')}: ${localize('can take few minutes')}...`}</p>
          </span>
          <Spinner className={'m-auto h-36 w-36 animate-spin fill-midnight  text-midnight-100'} />
        </div>
      )}
    </div>
  )
}
