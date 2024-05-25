import SecondaryButton from '@gatherwise/common-frontend-libs/components/materials/Button/SecondaryButton'
import { H1 } from '@gatherwise/common-frontend-libs/components/materials/Formatting'
import Table from '@gatherwise/common-frontend-libs/components/materials/Table'
import { withAuthenticatedUserLoader } from '@gatherwise/common-frontend-libs/libs/authentication'
import { useLocalize } from '@gatherwise/common-frontend-libs/libs/localization'
import { useSearchParams } from '@gatherwise/common-frontend-libs/libs/router'
import { classNames } from '@gatherwise/common-frontend-libs/libs/style'
import { useDynamicHeader } from '@gatherwise/common-frontend-libs/providers/DynamicHeaderProvider'
import { useLoadingContext } from '@gatherwise/common-frontend-libs/providers/LoadingProvider'
import { useCompanyService } from '@gatherwise/common-frontend-libs/services/endpoints/companies'
import { useState } from 'react'
import { useUserLinkService } from '../services/endpoints/user-links'
import { dynamicHeaderConfig } from './Settings'

export const loader = withAuthenticatedUserLoader(async ({ authenticatedUser }) => {
  return { authenticatedUser }
})

export function Component() {
  const localize = useLocalize()
  const [upgradeResult, setUpgradeResult] = useState([])
  const { isLoading } = useLoadingContext()
  const [searchParams] = useSearchParams()
  const companyService = useCompanyService()
  const userLinkService = useUserLinkService()
  const actionClassName = `text-nowrap text-sm`

  useDynamicHeader({
    ...dynamicHeaderConfig,
    placeholder: localize(dynamicHeaderConfig.placeholder),
    actionComponents: [
      () => {
        return (
          <SecondaryButton className={actionClassName} disabled={isLoading} onClick={handleUpgrade('global')}>
            {`${localize('upgrade')} ${localize('global')}`}
          </SecondaryButton>
        )
      },
      () => {
        return (
          <SecondaryButton className={actionClassName} disabled={isLoading} onClick={handleUpgrade('company')}>
            {`${localize('upgrade')} ${localize('companies')}`}
          </SecondaryButton>
        )
      },
      () => {
        return (
          <SecondaryButton className={actionClassName} disabled={isLoading} onClick={handleUpgrade('user-link')}>
            {`${localize('upgrade')} ${localize('user links')}`}
          </SecondaryButton>
        )
      },
      () => {
        return (
          <SecondaryButton
            className={actionClassName}
            disabled={isLoading}
            onClick={() => {
              setUpgradeResult([])
            }}
          >
            {localize('clear')}
          </SecondaryButton>
        )
      },
    ],
  })

  const handleUpgrade = (model) => () => {
    let upgradeInfrastructure = companyService.upgradeGlobalInfrastructure
    if (model === 'company') {
      upgradeInfrastructure = companyService.upgradeInfrastructure
    } else if (model === 'user-link') {
      upgradeInfrastructure = userLinkService.upgradeInfrastructure
    }

    upgradeInfrastructure(options)
      .then((upgraded) => {
        if (!Array.isArray(upgraded)) {
          upgraded = [upgraded]
        }

        setUpgradeResult([
          ...upgradeResult, // Merge with previous results
          ...upgraded.map((data) => {
            if (model === 'global') {
              return {
                _id: data._id,
                name: JSON.stringify(data.resourceChanges),
                version: data.infrastructureVersion,
                model,
                error: data?.error?.message,
                hasError: !!data?.error,
              }
            } else if (model === 'company') {
              return {
                _id: data._id,
                name: data.displayName,
                version: data.infrastructureVersion,
                model,
                error: data?.error?.message,
                hasError: !!data?.error,
              }
            } else if (model === 'user-link') {
              return {
                _id: data._id,
                name: `${data.username} [cid:${data.company}]`,
                version: data.infrastructureVersion,
                model: 'user-link',
                error: data?.error?.message,
                hasError: !!data?.error,
              }
            }

            return {
              _id: data._id,
              name: 'unknown model',
              version: data.infrastructureVersion,
              model,
              error: data?.error?.message,
              hasError: true,
            }
          }),
        ])
      })
      .catch((error) => {
        setUpgradeResult([
          {
            _id: 'null',
            name: 'null',
            version: 'null',
            model,
            error: String(error),
            hasError: true,
          },
        ])
      })
  }

  const options = {
    // Secret pagination for upgrades
    limit: searchParams.get('limit') ?? 5, // Number of upgrades max
    offset: searchParams.get('offset'), // Offset in the list of upgrades to do
    refresh: searchParams.get('refresh'), // Try to refresh infrastructure as code with live state
  }

  const baseClassName = 'px-2 py-1'
  return (
    <div className=''>
      <H1>{localize('upgrade infrastructure')}</H1>
      <p className='my-2'>
        Used to apply last settings released in the infrastructure service. Mostly update settings in Keycloak
      </p>
      <div className='overflow-y-auto py-3 sm:px-3'>
        <Table className={'w-full'}>
          <Table.Head>
            <Table.Row>
              <Table.Cell className={classNames(baseClassName)}>{localize('name')}</Table.Cell>
              <Table.Cell className={classNames(baseClassName)}>{localize('ID')}</Table.Cell>
              <Table.Cell className={classNames(baseClassName)}>{localize('model')}</Table.Cell>
              <Table.Cell className={classNames(baseClassName)}>{localize('version')}</Table.Cell>
              <Table.Cell className={classNames(baseClassName)}>{localize('error')}</Table.Cell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {Array.isArray(upgradeResult) &&
              upgradeResult.length > 0 &&
              upgradeResult.map((row, index) => (
                <Table.Row key={index}>
                  <Table.Cell className={classNames(baseClassName)}>{row.name}</Table.Cell>
                  <Table.Cell className={`px-2 py-1 ${row.hasError ? 'text-red-500' : ''}`}>
                    <pre className='font-mono text-xs'>{row._id}</pre>
                  </Table.Cell>
                  <Table.Cell className={classNames(baseClassName)}>{row.model}</Table.Cell>
                  <Table.Cell className={classNames(baseClassName)}>{row.version}</Table.Cell>
                  <Table.Cell className={(classNames(baseClassName), 'max-w-xs truncate')} title={row.error}>
                    {row.error ?? <span className='italic'>{localize('no error')}</span>}
                  </Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
        {upgradeResult.length === 0 && <span className='italic'>{localize('nothing to show') + '...'}</span>}
      </div>
    </div>
  )
}
