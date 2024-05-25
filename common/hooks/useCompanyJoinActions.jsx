import { subject } from '@casl/ability'
import { useEffect, useState } from 'react'
import { Action, Subject, roleEnum } from '../libs/authorization'
import { useLocalize } from '../libs/localization'
import { useAuthenticatedUser } from '../providers/AuthenticatedUserProvider'
import { useUserService } from '../services/endpoints/users'

/**
 * @typedef {Object} Action
 * @property {string} Action.key Unique key for the action
 * @property {boolean} Action.loading true when action is loading
 * @property {boolean} Action.disabled true when action is disabled
 * @property {string} Action.text Action text
 * @property {Function} Action.onClick Action when clicked
 *
 * @param {Object} params
 * @param {Object} params.company Company to join (from db)
 * @param {Function} params.onUpdate Called on successful update
 * @returns {{actions:Action[]}}
 */
export default function useCompanyJoinActions({ company, onUpdate }) {
  const [loading, setLoading] = useState(false)
  const localize = useLocalize()
  const authenticatedUser = useAuthenticatedUser()
  const userService = useUserService()
  const loadingEl = <span className='italic text-gray-500'>{localize('loading')}</span>
  const [actions, setActions] = useState([])

  useEffect(() => {
    if (!authenticatedUser?.isLoggedIn) return
    const userData = { username: authenticatedUser.username, companyId: company?._id, roles: [] }
    const canJoinAsSuperAdmin = authenticatedUser.can(
      Action.Create,
      subject(Subject.User, { ...userData, roles: [roleEnum.SuperAdmin] })
    )

    const managingUser = (actionPromise) => {
      setLoading(true)
      actionPromise
        .then((data) => {
          onUpdate && onUpdate(data)
        })
        .finally(() => {
          setLoading(false)
        })
    }

    const tmpActions = []
    if (!company.joined) {
      tmpActions.push({
        key: 'create',
        loading,
        disabled: loading,
        text: loading ? loadingEl : localize('join'),
        onClick: () => {
          managingUser(userService.create({ ...userData, roles: [roleEnum.CompanyAdmin] }))
        },
      })
    } else {
      tmpActions.push({
        key: 'delete',
        loading,
        disabled: loading,
        text:
          loading ? loadingEl
          : company.parent?._id === authenticatedUser.companyId ? localize('dissociate')
          : localize('leave'),
        onClick: () => {
          managingUser(userService.delete(authenticatedUser.username, { companyId: company._id }))
        },
      })
    }

    if (!company.joined && canJoinAsSuperAdmin) {
      tmpActions.push({
        key: 'create-super-admin',
        loading,
        disabled: loading,
        text: loading ? loadingEl : `${localize('join as')} ${localize(roleEnum.SuperAdmin)}`,
        onClick: () => {
          managingUser(userService.create({ ...userData, roles: [roleEnum.SuperAdmin] }))
        },
      })
    }

    setActions(tmpActions)
  }, [loading, company, authenticatedUser])

  return { actions, loading }
}
