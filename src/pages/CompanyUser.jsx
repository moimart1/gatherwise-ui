import { faCircle, faCircleCheck } from '@fortawesome/pro-regular-svg-icons'
import LightDangerButton from '@gatherwise/common-frontend-libs/components/materials/Button/LightDangerButton'
import PrimaryButton from '@gatherwise/common-frontend-libs/components/materials/Button/PrimaryButton'
import SecondaryButton from '@gatherwise/common-frontend-libs/components/materials/Button/SecondaryButton'
import Drawer from '@gatherwise/common-frontend-libs/components/materials/Drawer'
import { H1, H2 } from '@gatherwise/common-frontend-libs/components/materials/Formatting'
import Input from '@gatherwise/common-frontend-libs/components/materials/Input'
import { withAuthenticatedUserLoader } from '@gatherwise/common-frontend-libs/libs/authentication'
import { Action, Subject, roleEnum } from '@gatherwise/common-frontend-libs/libs/authorization'
import { subject } from '@gatherwise/common-frontend-libs/libs/authorization/casl-ability'
import { isoDateToHuman } from '@gatherwise/common-frontend-libs/libs/datetime'
import { FontAwesomeIcon } from '@gatherwise/common-frontend-libs/libs/icons'
import { useLocalize } from '@gatherwise/common-frontend-libs/libs/localization'
import { useLoaderData, useNavigate, useOutletContext, useSearchParams } from '@gatherwise/common-frontend-libs/libs/router'
import { classNames } from '@gatherwise/common-frontend-libs/libs/style'
import { useUserService } from '@gatherwise/common-frontend-libs/services/endpoints/users'
import { Label, Radio, RadioGroup } from '@headlessui/react'
import { useEffect, useState } from 'react'
import UserTile from '../components/UserTile'

export const loader = withAuthenticatedUserLoader(async ({ params, authenticatedUser }) => {
  return { authenticatedUser, companyId: params?.companyId, username: params?.username }
})

export function Component() {
  const { authenticatedUser, companyId, username } = useLoaderData()
  const [user, setUser] = useOutletContext()
  const [openUserDrawer, setOpenUserDrawer] = useState(false)
  const localize = useLocalize()
  const [formData, setFormData] = useState({ _id: '', username: '', roles: [roleEnum.User] })
  const userService = useUserService()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isCreating = !formData?._id

  const handleChange = (event) => {
    if (!event?.target) return
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    })
  }

  const handleClose = (user) => {
    setUser(user)
    setOpenUserDrawer(false)
    // Keep state in search parameters
    navigate(`../?${searchParams.toString()}`)
  }

  useEffect(() => {
    // Update form data with current user if exists
    if (user?.username && formData?.username !== user.username) {
      setFormData(user)
    }
  }, [user])

  useEffect(() => {
    // On loading
    if (!user?.username && username !== 'new') {
      // Set the user when the page is directly loaded
      userService.read(username, { companyId }).then((data) => {
        setUser(data)
      })
    }
    // Set open when loaded
    setOpenUserDrawer(true)
  }, [])

  useEffect(() => {
    switch (userService.error?.status) {
      case 403:
      case 404:
        handleClose({ error: userService.error })
        break

      default:
        break
    }
  }, [userService.error])

  return (
    <Drawer
      open={openUserDrawer}
      setOpen={(isOpen) => {
        if (!isOpen) {
          handleClose(user)
        }
      }}
    >
      <div className='flex h-full flex-col px-2 text-lg'>
        <H1>{isCreating ? localize('create a user') : localize('update the user')}</H1>
        <form className='mt-2 h-full'>
          <div className='flex h-full flex-col space-y-6 py-4'>
            {isCreating ?
              <div className='flex flex-col space-y-2'>
                <label id={'email-label'} className={'block'} htmlFor='username-label'>
                  <H2>{localize('email')}</H2>
                </label>
                <Input
                  id='username-label'
                  name='username'
                  type='text'
                  value={formData?.username}
                  onChange={handleChange}
                  placeholder='user@example.com'
                  disabled={!isCreating}
                />
                <span className='max-w-xs break-normal text-sm'>
                  {localize('Note: if the user has not email, you can create a fake email like') + ' '} <i>name@company.com</i>
                </span>
              </div>
            : <UserTile
                className={'text-xl'}
                firstName={user?.firstName}
                lastName={user?.lastName}
                username={user.username}
                disabledLabel={user?.enabled === false ? `(${localize('disabled')})` : ''}
                copiedLabel={localize('copied') + ' !'}
              />
            }

            <RadioGroup
              name='roles'
              value={formData?.roles?.at(0)}
              className={'space-y-2'}
              onChange={(value) => handleChange({ target: { name: 'roles', value: [value] } })}
            >
              <Label className={''}>
                <H2>{localize('role')}</H2>
              </Label>
              {(authenticatedUser.allowedRoles ?? []).map((role, idx) => {
                return (
                  <Radio
                    key={`role-${idx}`}
                    value={role}
                    disabled={authenticatedUser.cannot(
                      Action.Update,
                      subject(Subject.UserLink, {
                        username: user.username,
                        company: companyId,
                        roles: [role],
                      })
                    )}
                  >
                    {({ checked }) => (
                      <div
                        className={classNames(
                          'flex select-none flex-row items-center space-x-2 pl-2 text-base',
                          checked ? 'text-midnight' : 'text-midnight-500'
                        )}
                      >
                        <FontAwesomeIcon icon={checked ? faCircleCheck : faCircle} />
                        <span className={''}>{localize(role)}</span>
                      </div>
                    )}
                  </Radio>
                )
              })}
            </RadioGroup>
            <div className='grow border-b'></div>
            <div className='flex flex-col space-y-3 py-3'>
              <PrimaryButton
                disabled={userService.loading}
                onClick={() => {
                  const { username, roles } = formData
                  if (isCreating) {
                    userService
                      .create({
                        username: username.toLowerCase(),
                        roles,
                        companyId,
                      })
                      .then((data) => {
                        handleClose(data)
                      })
                  } else {
                    userService
                      .update(
                        user?.username /* TODO user?._id */,
                        {
                          roles,
                        },
                        { companyId }
                      )
                      .then((data) => {
                        handleClose(data)
                      })
                  }
                }}
              >
                {isCreating ? localize('add user') : localize('save')}
              </PrimaryButton>

              {!isCreating && (
                <>
                  <SecondaryButton
                    disabled={userService.loading}
                    onClick={() => {
                      userService.resetPassword(user?.username /* TODO user?._id */).then((data) => {
                        handleClose(data)
                      })
                    }}
                  >
                    {localize('reset password')}
                  </SecondaryButton>
                  <LightDangerButton
                    disabled={userService.loading}
                    onClick={() => {
                      userService
                        .delete(user?.username /* TODO user?._id */, {
                          companyId,
                        })
                        .then((data) => {
                          handleClose(data)
                        })
                    }}
                  >
                    {localize('revoke from company')}
                  </LightDangerButton>
                </>
              )}
            </div>
          </div>
        </form>
        {!isCreating && (
          <div className='flex flex-col text-left text-sm text-gray-500'>
            <span>{localize('created at') + ': ' + isoDateToHuman(user?.createdAt)}</span>
            <span>{localize('updated at') + ': ' + isoDateToHuman(user?.updatedAt)}</span>
            <span>
              {localize('ID') + ': '}
              <span className='font-mono text-xs'>{user?._id}</span>
            </span>
          </div>
        )}
      </div>
    </Drawer>
  )
}
