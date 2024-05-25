import { useParams } from 'react-router-dom'
import { H1, H2 } from '../components/materials/Formatting'
import { withAuthenticatedUserLoader } from '../libs/authentication'
import { copyToClipboardOnAction } from '../libs/clipboard'
import { useLocalize } from '../libs/localization'
import { useAuthenticatedUser } from '../providers/AuthenticatedUserProvider'
import { useDynamicHeader } from '../providers/DynamicHeaderProvider'

export const loader = withAuthenticatedUserLoader(async ({ authenticatedUser }) => {
  return { authenticatedUser }
})

export function Component({ dynamicHeaderConfig }) {
  const localize = useLocalize()
  const authenticatedUser = useAuthenticatedUser()
  const { companyId } = useParams()
  const headerConfig = {
    ...dynamicHeaderConfig,
    placeholder: localize(dynamicHeaderConfig.placeholder),
  }

  if (!companyId) {
    // Show menu only in on a company
    headerConfig.menuMap = []
  }

  useDynamicHeader(headerConfig)

  // More human readable dates
  const decodedToken = { ...authenticatedUser?.decodedToken }
  decodedToken.exp = new Date(decodedToken.exp * 1000)
  decodedToken.iat = new Date(decodedToken.iat * 1000)

  const decodedIdToken = { ...authenticatedUser?.decodedIdToken }
  decodedIdToken.exp = new Date(decodedIdToken.exp * 1000)
  decodedIdToken.iat = new Date(decodedIdToken.iat * 1000)

  return (
    <div className='flex flex-col space-y-4'>
      <H1>{localize('Expert information')}</H1>
      <H2>{localize('raw token')}</H2>
      <div className='space-y-1'>
        <span>{localize('access token')}</span>
        <pre
          className='cursor-pointer select-none whitespace-pre-line break-words px-1 text-xs sm:px-2'
          onDoubleClick={copyToClipboardOnAction({ copiedElement: `${localize('copied')} !` })}
        >
          {authenticatedUser?.accessToken}
        </pre>
        <span className='text-sm italic'>Note: Double click to copy</span>
      </div>
      <div className='space-y-1'>
        <span>{localize('ID token')}</span>
        <pre
          className='cursor-pointer select-none whitespace-pre-line break-words px-1 text-xs sm:px-2'
          onDoubleClick={copyToClipboardOnAction({ copiedElement: `${localize('copied')} !` })}
        >
          {authenticatedUser?.idToken}
        </pre>
        <span className='text-sm italic'>Note: Double click to copy</span>
      </div>

      <H2>{localize('decoded token')}</H2>
      <div className='space-y-1'>
        <span>{localize('access token')}</span>
        <pre className='text-xs'>{JSON.stringify(decodedToken, null, 2)}</pre>
      </div>
      <div className='space-y-1'>
        <span>{localize('ID token')}</span>
        <pre className='text-xs'>{JSON.stringify(decodedIdToken, null, 2)}</pre>
      </div>
      <H2>{localize('user abilities')}</H2>
      <ul className='list-disc text-sm'>
        {Array.isArray(authenticatedUser.ability?.rules) &&
          authenticatedUser.ability.rules.map((rule, idx) => {
            return (
              <li key={idx} className='ml-3 pb-2 pl-2'>
                {`Current user `}
                {rule?.inverted ?
                  <span className='text-red-600'>cannot </span>
                : <span className='text-green-600'>can </span>}
                <span className='font-bold'>{rule?.action?.join(', ')}</span>
                {' on '}
                <span className='font-bold'>{rule?.subject?.join(', ')}</span>
                {rule?.conditions ? ` when ` : ''}
                <span className='whitespace-pre-wrap text-xs'>
                  {rule?.conditions ? JSON.stringify(rule.conditions, null, 2) : ''}
                </span>
              </li>
            )
          })}
      </ul>
    </div>
  )
}
