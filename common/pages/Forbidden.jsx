import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import PrimaryButton from '../components/materials/Button/PrimaryButton'
import { useLocalize } from '../libs/localization'
import { useAuthenticatedUser } from '../providers/AuthenticatedUserProvider'
import Loading from './Loading'

export default function Forbidden({ children }) {
  const location = useLocation()
  const authenticatedUser = useAuthenticatedUser()
  const localize = useLocalize()

  useEffect(() => {
    if (!authenticatedUser?.isLoggedIn) {
      // Maybe it's forbidden because user is not logged in ?
      authenticatedUser?.login()
    }
  }, [authenticatedUser?.isLoggedIn])

  return (
      authenticatedUser?.isLoggedIn // Show forbidden only if user is logged in and ability is initialized
    ) ?
      <div className='w-full p-8 text-center'>
        <p className='text-xl font-bold'>{localize('forbidden')}</p>
        <p>{location.pathname}</p>

        <div className='p-8'>
          <PrimaryButton {...{ onClick: () => {} }}>
            <Link to={'/'}>{localize('return to homepage')}</Link>
          </PrimaryButton>
        </div>

        {children}
      </div>
    : <Loading />
}
