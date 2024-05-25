import { H2 } from '@gatherwise/common-frontend-libs/components/materials/Formatting'
import Input from '@gatherwise/common-frontend-libs/components/materials/Input'
import { useLocalize } from '@gatherwise/common-frontend-libs/libs/localization'
import slugify from 'slugify'
import SubscriptionsSelect from './SubscriptionsSelect'

export const defaultCompanyData = { _id: '', displayName: '', slugName: '', subscription: '', timezone: '' }

export function CompanyFormDisplayName({ className, formData, handleChange, disabled }) {
  const localize = useLocalize()
  return (
    <div className={className}>
      <label id={'display-name-label'} className={'block'} htmlFor='display-name'>
        <H2>{localize('company name')}</H2>
      </label>
      <Input
        id='display-name'
        name='displayName'
        type='text'
        value={formData?.displayName}
        onChange={(e) => {
          handleChange(e)
          // Update also the slug name
          handleChange({ target: { name: 'slugName', value: slugify(e.target.value, { lower: true, strict: true }) } })
        }}
        disabled={disabled}
      />
    </div>
  )
}
export default function CompanyForm({ formData, handleChange, disabled }) {
  const localize = useLocalize()

  return (
    <>
      {/* Display name */}
      <CompanyFormDisplayName
        className={'flex flex-col space-y-2'}
        formData={formData}
        handleChange={handleChange}
        disabled={disabled}
      />
      {/* Slug name */}
      <div className='flex flex-col space-y-2'>
        <label id={'slug-name-label'} className={'block'} htmlFor='slug-name'>
          <H2>{localize('slug name')}</H2>
        </label>
        <Input
          id='slug-name'
          name='slugName'
          type='text'
          className={'h-8 font-mono'}
          value={formData?.slugName}
          onChange={handleChange}
          disabled={disabled}
        />
      </div>
      {/* Subscriptions */}
      <div className='flex flex-col space-y-2'>
        <label id={'subscriptions-label'} className={'block'} htmlFor='subscriptions-label'>
          <H2>{localize('subscriptions')}</H2>
        </label>
        <SubscriptionsSelect
          company={formData}
          selected={formData?.subscription}
          onChange={(value) => handleChange({ target: { name: 'subscription', value } })}
        />
      </div>
    </>
  )
}
