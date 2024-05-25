import { subject } from '@casl/ability'
import { useState } from 'react'
import { Action, Subject, roleEnum } from '../libs/authorization'
import { useLocalize } from '../libs/localization'
import { useAuthenticatedUser } from '../providers/AuthenticatedUserProvider'
import { useUserService } from '../services/endpoints/users'
import ButtonGroupWithDropdown from './ButtonGroupWithDropdown'

export default function CompanyJoinButton({ company, onUpdate }) {
  const [loading, setLoading] = useState(false)
  const localize = useLocalize()
  const authenticatedUser = useAuthenticatedUser()
  const userService = useUserService()
  const additionalActions = []
  const userData = { username: authenticatedUser.username, companyId: company._id, roles: [] }
  const canJoinAsSuperAdmin =
    authenticatedUser?.isLoggedIn &&
    authenticatedUser.can(Action.Create, subject(Subject.User, { ...userData, roles: [roleEnum.SuperAdmin] }))

  const managingUser = (actionPromise) => {
    setLoading(true)
    actionPromise
      .then(() => {
        onUpdate && onUpdate()
      })
      .finally(() => {
        setLoading(false)
      })
  }

  if (company.joined) {
    additionalActions.push({
      text: company.parent?._id === authenticatedUser.companyId ? localize('dissociate') : localize('leave'),
      onClick: () => {
        managingUser(userService.delete(authenticatedUser.username, { companyId: company._id }))
      },
    })
  } else if (canJoinAsSuperAdmin) {
    additionalActions.push({
      text: localize('join as') + ' ' + localize(roleEnum.SuperAdmin),
      onClick: () => {
        managingUser(userService.create({ ...userData, roles: [roleEnum.SuperAdmin] }))
      },
    })
  }

  return (
    <ButtonGroupWithDropdown
      className={'flex min-w-fit items-center justify-end pr-3'}
      actions={[
        {
          disabled: !!company.joined || loading,
          text:
            loading ? localize('loading')
            : company.joined ? localize('joined')
            : localize('join'),
          onClick: () => {
            managingUser(userService.create({ ...userData, roles: [roleEnum.CompanyAdmin] }))
          },
        },
      ]}
      additionalActions={additionalActions}
    />
  )
}
