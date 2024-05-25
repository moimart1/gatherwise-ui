import PrimaryButton from '@gatherwise/common-frontend-libs/components/materials/Button/PrimaryButton'
import SecondaryButton from '@gatherwise/common-frontend-libs/components/materials/Button/SecondaryButton'
import Dialog from '@gatherwise/common-frontend-libs/components/materials/Dialog/Dialog'
import { baseUrlGlobalRealm } from '@gatherwise/common-frontend-libs/libs/constants'
import { useLocalize } from '@gatherwise/common-frontend-libs/libs/localization'

import { useState } from 'react'

export default function DialogRegistrationLink({ open, onClose, redirectUri }) {
  const localize = useLocalize()
  const [isCopied, setCopied] = useState(false)
  let registrationLink =
    `${baseUrlGlobalRealm}/protocol/openid-connect/registrations` +
    `?client_id=website-registration&response_type=code&scope=openid`

  if (redirectUri) {
    registrationLink += `&redirect_uri=${redirectUri}`
  }

  return (
    <Dialog
      title={localize('registration link')}
      open={open}
      onClose={onClose}
      ActionComponent={
        <>
          <SecondaryButton onClick={onClose}>{localize('close')}</SecondaryButton>
        </>
      }
    >
      <span className='p-1'>
        {localize(
          'share the link with the company admin. The company administrator will be prompted to create a new company which will be visible in your list of companies'
        )}
      </span>
      <div className='flex w-full flex-row'>
        <div className={`m-1 w-5/6 overflow-y-auto whitespace-nowrap rounded bg-midnight-50 p-3 font-mono`}>
          {registrationLink}
        </div>
        <PrimaryButton
          className={`m-auto h-10 w-fit`}
          disabled={isCopied}
          onClick={() => {
            navigator.clipboard.writeText(registrationLink)
            setCopied(true)
            setTimeout(() => setCopied(false), 3000)
          }}
        >
          {localize(isCopied ? 'copied' : 'copy')}
        </PrimaryButton>
      </div>
    </Dialog>
  )
}
