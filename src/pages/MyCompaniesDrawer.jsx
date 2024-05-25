import PrimaryButton from '@gatherwise/common-frontend-libs/components/materials/Button/PrimaryButton'
import SecondaryButton from '@gatherwise/common-frontend-libs/components/materials/Button/SecondaryButton'
import Drawer from '@gatherwise/common-frontend-libs/components/materials/Drawer'
import { H1 } from '@gatherwise/common-frontend-libs/components/materials/Formatting'
import { withAuthenticatedUserLoader } from '@gatherwise/common-frontend-libs/libs/authentication'
import { Action, Subject, roleEnum } from '@gatherwise/common-frontend-libs/libs/authorization'
import { subject } from '@gatherwise/common-frontend-libs/libs/authorization/casl-ability'
import { useFormData } from '@gatherwise/common-frontend-libs/libs/form'
import { useLocalize } from '@gatherwise/common-frontend-libs/libs/localization'
import { useLoaderData, useNavigate, useOutletContext, useSearchParams } from '@gatherwise/common-frontend-libs/libs/router'
import { useCompanyService } from '@gatherwise/common-frontend-libs/services/endpoints/companies'
import { useEffect, useRef, useState } from 'react'
import CompanyForm, { defaultCompanyData } from '../components/CompanyForm'

export const loader = withAuthenticatedUserLoader(async ({ params, authenticatedUser }) => {
  return { authenticatedUser, companyId: params?.companyId, childCompanyId: params?.childCompanyId }
})

export function Component() {
  const { authenticatedUser, companyId, childCompanyId } = useLoaderData()
  const [company, setCompany] = useOutletContext()
  const isMounted = useRef(false)
  const [openUserDrawer, setOpenUserDrawer] = useState(false)
  const localize = useLocalize()
  const { formData, setFormData, handleChange } = useFormData(defaultCompanyData)
  const companyService = useCompanyService()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isCreating = !formData?._id

  const handleSubmit =
    (additionalData = {}) =>
    (event) => {
      event.preventDefault()
      const { displayName, slugName, subscription } = formData
      const data = { displayName, slugName, subscription }
      if (isCreating) {
        companyService
          .create({
            ...data,
            ...additionalData,
            parentId: companyId,
          })
          .then((data) => {
            handleClose({ ...data, new: true })
          })
      } else {
        companyService
          .update(company?._id, {
            _id: company?._id,
            ...data,
          })
          .then((data) => {
            handleClose({ ...data, new: false })
          })
      }
    }

  const handleClose = (company) => {
    setCompany(company)
    setOpenUserDrawer(false)
    // Keep state in search parameters
    navigate(`${isMounted.current ? '..' : '.'}/?${searchParams.toString()}`)
  }

  useEffect(() => {
    // Update form data with current user if exists
    if (company?._id && formData?._id !== company._id) {
      setFormData({ ...defaultCompanyData, ...company })
    }
  }, [company])

  useEffect(() => {
    // On loading
    isMounted.current = true
    if (!company?._id && childCompanyId !== 'new') {
      // Set the user when the page is directly loaded
      companyService.read(childCompanyId).then((data) => {
        setCompany(data)
      })
    }
    // Set open when loaded
    setOpenUserDrawer(true)
    return () => {
      isMounted.current = false
    }
  }, [])

  useEffect(() => {
    switch (companyService.error?.status) {
      case 403:
      case 404:
        handleClose({ error: companyService.error })
        break

      default:
        break
    }
  }, [companyService.error])

  return (
    <Drawer
      open={openUserDrawer}
      setOpen={(isOpen) => {
        if (!isOpen) {
          handleClose(company)
        }
      }}
    >
      <div className='flex h-full flex-col px-2 text-lg'>
        <H1>{isCreating ? localize('create a company') : localize('update the company')}</H1>
        <form className='mt-2 h-full'>
          <div className='flex h-full flex-col space-y-6 py-4'>
            <CompanyForm formData={formData} handleChange={handleChange} disabled={companyService.loading} />
            <div className='grow border-b'></div>
            <div className='flex flex-col space-y-3 py-3'>
              <PrimaryButton
                disabled={
                  companyService.loading ||
                  authenticatedUser?.cannot(isCreating ? Action.Create : Action.Update, subject(Subject.Company, company))
                }
                onClick={handleSubmit()}
              >
                {isCreating ? localize('create') : localize('save')}
              </PrimaryButton>
              {isCreating &&
                authenticatedUser?.can(
                  // Can create a user as super admin in the new company
                  Action.Create,
                  subject(Subject.User, {
                    username: authenticatedUser.username,
                    companyId: authenticatedUser.companyId,
                    roles: [roleEnum.SuperAdmin],
                  })
                ) && (
                  <SecondaryButton
                    disabled={companyService.loading}
                    onClick={handleSubmit({ ownerRoles: [roleEnum.SuperAdmin] })}
                  >
                    {localize('create for a partner')}
                  </SecondaryButton>
                )}
            </div>
          </div>
        </form>
      </div>
    </Drawer>
  )
}
