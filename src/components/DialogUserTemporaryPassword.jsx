import PrimaryButton from '@gatherwise/common-frontend-libs/components/materials/Button/PrimaryButton'
import SecondaryButton from '@gatherwise/common-frontend-libs/components/materials/Button/SecondaryButton'
import Dialog from '@gatherwise/common-frontend-libs/components/materials/Dialog/Dialog'
import { serviceEnum } from '@gatherwise/common-frontend-libs/libs/constants'
import { useLocalize } from '@gatherwise/common-frontend-libs/libs/localization'
import { getServiceOrigin } from '@gatherwise/common-frontend-libs/libs/urls'

export default function DialogUserTemporaryPassword({ open, onClose, user }) {
  const localize = useLocalize()
  const url = getServiceOrigin(serviceEnum.webapp)

  return (
    <Dialog
      title={localize('temporary password')}
      open={open}
      onClose={onClose}
      ActionComponent={
        <>
          <PrimaryButton
            onClick={(e) => {
              const newLine = '%0D%0A'
              const subject = `${localize('your credentials for')} Gatherwise`
              const body =
                `${localize(`hi`)},${newLine + newLine}${localize('Here are your credentials to log in to')} Gatherwise` +
                ` (https://gatherwise.com).${newLine}` +
                `${localize('go to')} ${url}. ${localize('then enter your temporary credentials in the login page')}:` +
                newLine +
                newLine +
                `${localize('email')}: ${user?.username}${newLine}` +
                `${localize('temporary password')}: ${user?.temporaryPassword}${newLine}`

              window.location.href = `mailto:${user?.username}?subject=${subject}&body=${body}`
              e.preventDefault()
            }}
          >
            {localize('open in e-mail')}
          </PrimaryButton>
          <SecondaryButton onClick={onClose}>{localize('close')}</SecondaryButton>
        </>
      }
    >
      <span className='p-1'>{localize('please note the following information, this is the last time you will see it')}</span>
      <div className='m-1 flex flex-col rounded bg-gray-50 p-3'>
        <div>
          <span className='font-bold'>{localize('url') + ': '}</span>
          <a target={'_blank'} href={url} rel='noreferrer'>
            {url}
          </a>
        </div>
        <div>
          <span className='font-bold'>{localize('email') + ': '}</span>
          <span className='font-mono'>{user?.username}</span>
        </div>
        <div>
          <span className='font-bold'>{localize('temporary password') + ': '}</span>
          <span className='font-mono'>{user?.temporaryPassword}</span>
        </div>
      </div>
    </Dialog>
  )
}
