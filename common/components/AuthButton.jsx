import { useLocalize } from '../libs/localization'
import { useAuthenticatedUser } from '../providers/AuthenticatedUserProvider'

export default function AuthButton() {
  const localize = useLocalize()
  const user = useAuthenticatedUser()

  return (
    <button
      {...{
        className: `rounded border py-1 px-2 w-full hover:bg-white`,
        onClick: () => {
          user?.logout()
        },
      }}
    >
      {localize('logout')}
    </button>
  )
}
