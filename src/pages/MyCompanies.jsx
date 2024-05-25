import EditableTotal from '@gatherwise/common-frontend-libs/components/EditableTotal'
import SecondaryButton from '@gatherwise/common-frontend-libs/components/materials/Button/SecondaryButton'
import H2 from '@gatherwise/common-frontend-libs/components/materials/Formatting/H2'
import Table from '@gatherwise/common-frontend-libs/components/materials/Table'
import { withAuthenticatedUserLoader } from '@gatherwise/common-frontend-libs/libs/authentication'
import { Action, Subject } from '@gatherwise/common-frontend-libs/libs/authorization'
import { humanError } from '@gatherwise/common-frontend-libs/libs/error'
import { useLocalize } from '@gatherwise/common-frontend-libs/libs/localization'
import { Outlet, useLoaderData, useNavigate, useParams, useRevalidator } from '@gatherwise/common-frontend-libs/libs/router'
import { encodeUrlObjectParams, getServiceOrigin } from '@gatherwise/common-frontend-libs/libs/urls'
import { useAuthenticatedUser } from '@gatherwise/common-frontend-libs/providers/AuthenticatedUserProvider'
import { useDynamicHeader } from '@gatherwise/common-frontend-libs/providers/DynamicHeaderProvider'
import { useSnackBar } from '@gatherwise/common-frontend-libs/providers/SnackBarProvider'
import { getCompanyService, useCompanyService } from '@gatherwise/common-frontend-libs/services/endpoints/companies'
import { useMemo, useState } from 'react'
import CompaniesList from '../components/CompaniesList'
import DialogRegistrationLink from '../components/DialogRegistrationLink'

export const loader = withAuthenticatedUserLoader(async ({ params, authenticatedUser }) => {
  const companies = await getCompanyService().readAll({
    includeJoinable: true,
    includeCount: true,
    from: params.companyId,
  })
  return { authenticatedUser, companies }
})

export function Component() {
  console.log('[MyCompanies] init')
  const localize = useLocalize()
  const { companies } = useLoaderData()
  const { companyId } = useParams()
  const { revalidate } = useRevalidator()
  const [global, setGlobal] = useState(null)
  const [openDialog, setDialogOpen] = useState(false)
  const companyService = useCompanyService()
  const onCompanyListChange = () => revalidate() // force refresh
  const authenticatedUser = useAuthenticatedUser()
  const [focusedCompany, setFocusedCompany] = useState({})
  const snackbar = useSnackBar()
  const navigate = useNavigate()

  useDynamicHeader({
    placeholder: localize('my companies'),
    actionComponents: [
      () => {
        return (
          <SecondaryButton
            className={'text-sm'}
            onClick={() => {
              setDialogOpen(true)
            }}
          >
            {localize('show invitation link')}
          </SecondaryButton>
        )
      },
      () => {
        if (authenticatedUser?.cannot(Action.Create, Subject.Company)) {
          return <></>
        }

        return (
          <SecondaryButton className={'text-sm'} icon='fa-solid fa-plus' onClick={handleCompany()}>
            {localize('create company')}
          </SecondaryButton>
        )
      },
    ],
  })

  const handleCompany =
    (data = {}) =>
    () => {
      setFocusedCompany(data)
      // Keep search params states
      navigate(`${data?._id ? data._id : 'new'}`)
    }

  const groupedCompanies = useMemo(() => {
    const group = { [companyId]: {} } // Trick to have current company first
    for (let company of companies) {
      company = { quota: {}, ...company } // Need to initialize quota since it's a new feature

      if (company.hasChildren === true) {
        // Set parent with Partners or root companies
        group[company._id] = { parent: company, ...(group[company._id] ?? {}) } // Set parent, merge with existing group
        if (!company.parent?._id) {
          // Root company
          setGlobal(company)
          continue
        }
      }

      // Set children companies, can be a partner or customer companies
      if (!group[company.parent?._id]?.children) {
        // Set children, merge with existing group
        group[company.parent._id] = { children: [], ...(group[company.parent._id] ?? {}) }
      }

      group[company.parent?._id].children.push(company)
    }

    return group
  }, [companies])

  return (
    <div className=''>
      <div className='py-3'>
        {global && (
          <div className='mb-4 flex flex-col overflow-hidden sm:w-1/3'>
            <div className='py-2'>
              <H2>{localize('global')}</H2>
            </div>
            <Table className={'mx-2 w-full sm:mx-10'}>
              <Table.Head>
                <Table.Row>
                  {[
                    { title: '', note: '' },
                    { title: 'quotas', note: '' },
                  ].map((head, idx) => (
                    <Table.HeadCell key={idx} className={''}>
                      <span>{localize(head.title)}</span>
                      {head.note && (
                        <span className='ml-1 flex flex-col font-sans text-xs font-normal italic text-gray-500'>
                          {localize(head.note)}
                        </span>
                      )}
                    </Table.HeadCell>
                  ))}
                </Table.Row>
              </Table.Head>
              <Table.Body key='global'>
                {global?.quota &&
                  [
                    { title: 'companies', key: 'companies' },
                    { title: 'users', key: 'users' },
                    { title: 'machines', key: 'machines' },
                  ].map((attribute) => {
                    return (
                      <Table.Row key={attribute.key} className={'text-left font-sans font-normal'}>
                        <Table.Cell className={'pl-2 font-normal'}>{localize(attribute.title)}</Table.Cell>
                        <Table.Cell className={'pl-2'}>
                          <EditableTotal
                            count={global?.count?.[attribute.key]}
                            defaultTotal={global?.quota?.[attribute.key]}
                            onChange={(value) => {
                              global.quota[attribute.key] = value
                              setGlobal({ ...global })
                            }}
                            onEdited={(value) => {
                              companyService
                                .updateQuota(global._id, { ...global.quota, [attribute.key]: value })
                                .catch((err) => err) // silent
                            }}
                          />
                        </Table.Cell>
                      </Table.Row>
                    )
                  })}
              </Table.Body>
            </Table>
          </div>
        )}
        {groupedCompanies ?
          <div className='flex flex-col'>
            {Object.values(groupedCompanies).map((groupedCompany, idx) => {
              const groupId = groupedCompany?.parent?._id ?? ''
              if (!groupId) {
                return <div key={`root-${idx}`}></div>
              }

              return (
                <div key={groupId}>
                  <div className='mb-4 py-4'>
                    <H2>{`${localize('managed by')} ${groupedCompany?.parent?.displayName}`}</H2>
                  </div>
                  <CompaniesList
                    className={'px-2 sm:px-10'}
                    onEdit={(company) => {
                      handleCompany(company)()
                    }}
                    onChange={(updatedCompany, event, path) => {
                      if (event === CompaniesList.ChangeEventEnum.changed) {
                        if (updatedCompany._id === groupedCompanies[groupId].parent._id) {
                          // Update parent
                          groupedCompanies[groupId].parent = updatedCompany
                        } else {
                          groupedCompanies[groupId].children = groupedCompanies[groupId].children.map((company, idx) => {
                            if (company._id === updatedCompany._id) groupedCompanies[groupId].children[idx] = updatedCompany
                            return groupedCompanies[groupId].children[idx]
                          })
                        }
                      } else if (event === CompaniesList.ChangeEventEnum.edited) {
                        if (path.startsWith('quota')) {
                          companyService.updateQuota(updatedCompany._id, updatedCompany.quota).catch((err) => err) // silent
                        }
                      } else {
                        // Refresh list
                        onCompanyListChange()
                      }
                    }}
                    {...{ companies: groupedCompany.children, parentCompany: groupedCompany.parent }}
                  />
                </div>
              )
            })}
          </div>
        : <p className='py-2'>
            {!companyService.isReady ?
              <>Loading...</>
            : <>You do not belong to a company</>}
          </p>
        }
      </div>
      <Outlet
        context={[
          focusedCompany,
          (company) => {
            if (company?.error) {
              snackbar.error(humanError(company.error, { localize }))
              return
            }

            setFocusedCompany(company)
            if (company?._id && company?.new !== undefined) {
              const actionLabel =
                company?.new === false ? localize('updated', { capitalize: false }) : localize('created', { capitalize: false })
              snackbar.success(`${localize('company')} ${company.displayName} ${actionLabel}`)
            }
          },
        ]}
      />
      <DialogRegistrationLink
        open={openDialog}
        onClose={() => setDialogOpen(false)}
        redirectUri={encodeURI(
          `${getServiceOrigin()}/new?affiliate=${encodeUrlObjectParams({
            parentId: companyId, // Use object to be more future proof
          })}`
        )}
      />
    </div>
  )
}
