import { faEdit } from '@fortawesome/pro-regular-svg-icons'
import ButtonsPrevNext from '@gatherwise/common-frontend-libs/components/ButtonsPrevNext'
import SearchBar, { SearchTags } from '@gatherwise/common-frontend-libs/components/SearchBar'
import SecondaryButton from '@gatherwise/common-frontend-libs/components/materials/Button/SecondaryButton'
import Chip from '@gatherwise/common-frontend-libs/components/materials/Chip'
import { H1 } from '@gatherwise/common-frontend-libs/components/materials/Formatting'
import Table from '@gatherwise/common-frontend-libs/components/materials/Table'
import { withAuthenticatedUserLoader } from '@gatherwise/common-frontend-libs/libs/authentication'
import { Action, Subject } from '@gatherwise/common-frontend-libs/libs/authorization'
import { isoDateToHuman } from '@gatherwise/common-frontend-libs/libs/datetime'
import { useDebounce } from '@gatherwise/common-frontend-libs/libs/debounce'
import { humanError } from '@gatherwise/common-frontend-libs/libs/error'
import { FontAwesomeIcon } from '@gatherwise/common-frontend-libs/libs/icons'
import { useLocalize } from '@gatherwise/common-frontend-libs/libs/localization'
import { Outlet, useLoaderData, useNavigate, useSearchParams } from '@gatherwise/common-frontend-libs/libs/router'
import { useDynamicHeader } from '@gatherwise/common-frontend-libs/providers/DynamicHeaderProvider'
import { useSnackBar } from '@gatherwise/common-frontend-libs/providers/SnackBarProvider'
import { getUserService } from '@gatherwise/common-frontend-libs/services/endpoints/users'
import React, { useEffect, useState } from 'react'
import DialogUserTemporaryPassword from '../components/DialogUserTemporaryPassword'
import UserTile from '../components/UserTile'

const pageLimit = 10
const defaultSearchParams = { offset: 0, limit: pageLimit, q: '' }

function userEntity(user) {
  return {
    ...{
      _id: '',
      emailVerified: null,
      enabled: null,
      firstName: '',
      lastName: '',
      roles: [],
      newUser: null,
      temporaryPassword: '',
      username: '',
    },
    ...(user ?? {}),
  }
}

export const loader = withAuthenticatedUserLoader(async ({ params, authenticatedUser, request }) => {
  // TODO  withAbilityLoader
  const url = new URL(request.url)
  const users = await getUserService().readAll({
    companyId: params.companyId,
    offset: url.searchParams.get('offset') ?? defaultSearchParams.offset,
    limit: url.searchParams.get('limit') ?? defaultSearchParams.pageLimit,
    search: url.searchParams.get('q') ?? defaultSearchParams.q,
  })
  return { authenticatedUser, users }
})

export function Component() {
  const { users, authenticatedUser } = useLoaderData()
  const [userQuery, setUserQuery] = useState('')
  const [focusedUser, setFocusedUser] = useState(userEntity())
  const [openDialog, setDialogOpen] = useState(false)
  const snackbar = useSnackBar()
  const debouncedBackendSearch = useDebounce(userQuery, 500)
  const [searchParams, setSearchParams] = useSearchParams(defaultSearchParams)
  const localize = useLocalize()
  const navigate = useNavigate()

  useDynamicHeader({
    placeholder: localize('users'),
    actionComponents: [
      () => {
        const [searchQuery, setSearchQuery] = useState('')
        return (
          <SearchBar
            key={'search-user'}
            compact
            className={'max-w-48 sm:max-w-full'}
            onClick={(e) => e.preventDefault()}
            searchQuery={searchQuery}
            onSearchQuery={(query) => {
              setSearchQuery(query)
              setUserQuery(query)
            }}
          />
        )
      },
      () => {
        if (authenticatedUser?.can(Action.Create, Subject.User)) {
          return (
            <SecondaryButton icon={'fa-solid fa-plus'} className={`text-nowrap`} onClick={handleUser()}>
              {localize('add user') + '...'}
            </SecondaryButton>
          )
        }
        return <></>
      },
    ],
  })

  const handleUser =
    (data = {}) =>
    () => {
      setFocusedUser(userEntity(data))
      // Keep search params states
      navigate(`${data?.username ? data.username : 'new'}?${searchParams.toString()}`)
    }

  const handleDialogTemporaryPassword = ({ open = false, user }) => {
    if (user) {
      if (!user?.temporaryPassword) return // Nothing to do
      setFocusedUser(userEntity(user))
    }

    setDialogOpen(open)
  }

  useEffect(() => {
    setSearchParams((previous) => {
      // Force default pagination
      previous.set('offset', 0)
      previous.set('limit', pageLimit)
      previous.set('q', debouncedBackendSearch)
      return new URLSearchParams(previous)
    })
  }, [debouncedBackendSearch])

  return (
    <div className=''>
      <div className='py-3'>
        <H1>{localize('user list')}</H1>
        <div className='overflow-y-auto py-4'>
          <Table className={'w-full'}>
            <Table.Head>
              <Table.Row>
                <Table.HeadCell></Table.HeadCell>
                <Table.HeadCell className={'px-2'}>{localize('roles')}</Table.HeadCell>
                <Table.HeadCell className={'whitespace-nowrap text-nowrap px-2'}>{localize('created at')}</Table.HeadCell>
                <Table.HeadCell className={'whitespace-nowrap text-nowrap px-2'}>{localize('updated at')}</Table.HeadCell>
                <Table.HeadCell></Table.HeadCell>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {Array.isArray(users) &&
                users.length > 0 &&
                users.map((row) => (
                  <Table.Row key={row.username} className={'border-0'}>
                    <SearchTags tags={Object.values(row)} query={userQuery} key={row.username}>
                      <Table.Cell className={'px-4 py-3'}>
                        <UserTile
                          firstName={row?.firstName}
                          lastName={row?.lastName}
                          username={row.username}
                          onClick={handleUser(row)}
                          disabledLabel={row?.enabled === false ? `(${localize('disabled')})` : ''}
                        />
                      </Table.Cell>
                      <Table.Cell className={'px-2'}>
                        {Array.isArray(row?.roles) &&
                          row.roles.map((role) => {
                            return (
                              <Chip
                                key={role}
                                variant={Chip.VariantEnum.gray}
                                className={'font-sherif h-5 w-fit truncate whitespace-nowrap text-sm'}
                              >
                                {localize(role)}
                              </Chip>
                            )
                          })}
                      </Table.Cell>
                      <Table.Cell className={'whitespace-nowrap text-nowrap px-2 text-sm'}>
                        {isoDateToHuman(row.createdAt)}
                      </Table.Cell>
                      <Table.Cell className={'whitespace-nowrap text-nowrap px-2 text-sm'}>
                        {isoDateToHuman(row.updatedAt)}
                      </Table.Cell>
                      <Table.Cell className={'px-2'}>
                        <button title='edit' onClick={handleUser(row)}>
                          <FontAwesomeIcon icon={faEdit} color='#001B44' size='xl' />
                        </button>
                      </Table.Cell>
                    </SearchTags>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table>
        </div>
        <div className='flex w-full items-center justify-end space-x-2'>
          {users.length === 0 && <span className='italic'>{localize('nothing to show') + '...'}</span>}
          <ButtonsPrevNext
            className={'border-midnight-500 text-midnight-500'}
            previousDisabled={parseInt(searchParams.get('offset')) === 0}
            nextDisabled={users?.length === 0}
            onPrevious={() => {
              setSearchParams((previous) => {
                const offset = parseInt(previous.get('offset')) - pageLimit
                previous.set('offset', offset > 0 ? offset : 0)
                previous.set('limit', pageLimit)
                return new URLSearchParams(previous)
              })
            }}
            onNext={() => {
              setSearchParams((previous) => {
                previous.set('offset', parseInt(previous.get('offset')) + pageLimit)
                previous.set('limit', pageLimit)
                return new URLSearchParams(previous)
              })
            }}
          />
        </div>
      </div>
      <Outlet
        context={[
          focusedUser,
          (user) => {
            if (user?.error) {
              snackbar.error(humanError(user.error, { localize }))
              return
            }

            if (user?.temporaryPassword) {
              handleDialogTemporaryPassword({ open: true, user })
            }
            setFocusedUser(user)
          },
        ]}
      />
      <DialogUserTemporaryPassword
        open={openDialog}
        onClose={() => handleDialogTemporaryPassword({ open: false })}
        user={focusedUser}
      />
    </div>
  )
}
