import { faDiagramProject as faDiagramProjectRegular } from '@fortawesome/pro-regular-svg-icons'
import { faIndustry as faIndustryRegular } from '@fortawesome/pro-regular-svg-icons/faIndustry'
import { faDiagramProject as faDiagramProjectSolid } from '@fortawesome/pro-solid-svg-icons'
import { faIndustry as faIndustrySolid } from '@fortawesome/pro-solid-svg-icons/faIndustry'
import EditableTotal from '@gatherwise/common-frontend-libs/components/EditableTotal'
import ThreeDotButton from '@gatherwise/common-frontend-libs/components/materials/Button/ThreeDotButton'
import Chip from '@gatherwise/common-frontend-libs/components/materials/Chip'
import Table from '@gatherwise/common-frontend-libs/components/materials/Table'
import useCompanyJoinActions from '@gatherwise/common-frontend-libs/hooks/useCompanyJoinActions'
import { FontAwesomeIcon } from '@gatherwise/common-frontend-libs/libs/icons'
import { useLocalize } from '@gatherwise/common-frontend-libs/libs/localization'
import { setValue } from '@gatherwise/common-frontend-libs/libs/object'
import { Link } from '@gatherwise/common-frontend-libs/libs/router'
import { companyPath } from '@gatherwise/common-frontend-libs/libs/urls'
import { useState } from 'react'

const ChangeEventEnum = {
  changed: 'changed',
  edited: 'edited',
  joined: 'joined',
}

const CompaniesList = ({ companies, parentCompany, className, onChange, onEdit }) => {
  const localize = useLocalize()
  const [toggleEditing, setToggleEditing] = useState({})
  const onChangeHook = (company, event, path) => (value) => {
    console.log('[CompaniesList] onChangeHook', company.displayName, event, path, value)
    setValue(company, path, value)
    onChange && onChange(company, event, path)
  }

  return (
    <div className={className}>
      <div className='h-full w-full overflow-y-auto'>
        <Table className={'w-full table-auto'}>
          <Table.Head>
            <Table.Row>
              {[
                { title: '', note: '' },
                { title: 'name', note: '' },
                { title: 'subscription', note: '' },
                { title: 'quotas', note: '' },
                { title: '', note: '' },
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
          <Table.Body>
            {Array.isArray(companies) &&
              companies.map((company) => {
                const className = 'py-4'
                return (
                  <Table.Row key={company._id} className={''}>
                    <Table.Cell className={className}>
                      {(
                        company.hasChildren // Companies with children are partners
                      ) ?
                        <FontAwesomeIcon {...{ icon: company.joined ? faDiagramProjectSolid : faDiagramProjectRegular }} />
                      : <FontAwesomeIcon {...{ icon: company.joined ? faIndustrySolid : faIndustryRegular }} />}
                    </Table.Cell>
                    <Table.Cell className={'truncate'}>
                      <Link to={company.joined ? `${companyPath(company._id)}` : '#'} className=''>
                        {company.displayName}
                      </Link>
                    </Table.Cell>
                    <Table.Cell className={'flex h-16 max-w-80 flex-wrap items-center gap-1 px-2 py-2'}>
                      <Chip
                        key={company?.subscription}
                        variant={Chip.VariantEnum.gray}
                        className={'font-sherif h-5 w-fit truncate whitespace-nowrap text-xs'}
                      >
                        {localize(company?.subscription)}
                      </Chip>
                    </Table.Cell>
                    <Table.Cell className={'whitespace-nowrap px-2 font-sans'}>
                      <span className=''>
                        {[
                          { title: 'users', key: 'users' },
                          { title: 'machines', key: 'machines' },
                        ].map((attribute) => {
                          return (
                            <div key={attribute.key} className='flex flex-row gap-x-2 whitespace-nowrap'>
                              <span className='w-1/2 min-w-fit text-nowrap text-left'>{localize(attribute.title)}</span>
                              <EditableTotal
                                className={'w-1/2 min-w-fit'}
                                count={company?.count?.[attribute.key]}
                                toggleEditing={toggleEditing[company?._id]}
                                defaultTotal={company?.quota?.[attribute.key]}
                                onChange={onChangeHook(company, ChangeEventEnum.changed, `quota.${attribute.key}`)}
                                onEdited={onChangeHook(company, ChangeEventEnum.edited, `quota.${attribute.key}`)}
                              />
                            </div>
                          )
                        })}
                      </span>
                    </Table.Cell>
                    <Table.Cell className={className}>
                      <MenuActions
                        company={company}
                        onUpdate={(updated) => onChangeHook(company, ChangeEventEnum.joined, 'joined')(updated?.joined)}
                        additionalActions={[
                          {
                            key: 'edit',
                            title: localize('edit'),
                            onClick: () => {
                              onEdit(company)
                            },
                          },
                          {
                            key: 'edit-quota',
                            title: localize('edit quota'),
                            onClick: () => {
                              setToggleEditing((prev) => ({ ...prev, [company._id]: !prev[company._id] })) // trig edit mode
                            },
                          },
                        ]}
                      />
                    </Table.Cell>
                  </Table.Row>
                )
              })}
            <Table.Row className={'bg-gray-50 py-2'}>
              <Table.Cell>{/* Icon */}</Table.Cell>
              <Table.Cell>{/* Names */}</Table.Cell>
              <Table.Cell className={'pr-6 text-right align-top'}>{localize('total')}</Table.Cell>
              <Table.Cell className={'text-center'}>
                {/* Quotas */}
                <span className=''>
                  {parentCompany?.quota &&
                    [
                      { title: 'companies', key: 'companies' },
                      { title: 'users', key: 'users' },
                      { title: 'machines', key: 'machines' },
                    ].map((attribute) => {
                      return (
                        <div key={attribute.key} className='grid grid-cols-2 gap-x-1'>
                          <span className='text-left'>{localize(attribute.title)}</span>
                          <EditableTotal
                            count={parentCompany?.count?.children?.[attribute.key]}
                            defaultTotal={parentCompany?.quota?.children?.[attribute.key]}
                            className={'font-sans font-normal'}
                            onChange={onChangeHook(parentCompany, ChangeEventEnum.changed, `quota.children.${attribute.key}`)}
                            onEdited={onChangeHook(parentCompany, ChangeEventEnum.edited, `quota.children.${attribute.key}`)}
                          />
                        </div>
                      )
                    })}
                </span>
              </Table.Cell>
              <Table.Cell className={'text-center'}></Table.Cell>
              <Table.Cell>{/* Actions */}</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </div>
    </div>
  )
}

CompaniesList.ChangeEventEnum = ChangeEventEnum
export default CompaniesList

function MenuActions({ company, additionalActions, onUpdate }) {
  const { actions } = useCompanyJoinActions({ company, onUpdate })
  const menuItemClassName = 'px-4 py-1'
  return (
    <ThreeDotButton className={'w-8 text-midnight'} itemsClassName={'flex flex-col space-y-1 py-1'} size='lg'>
      {Array.isArray(additionalActions) &&
        additionalActions.map(({ key, title, onClick }) => {
          return (
            <ThreeDotButton.MenuItem key={key} className={menuItemClassName}>
              <button className='w-full' onClick={onClick}>
                {title}
              </button>
            </ThreeDotButton.MenuItem>
          )
        })}
      {actions.map(({ text, key, disabled, onClick }) => {
        // Reduce font size if text is long
        const el = typeof text === 'string' && text.length > 10 ? <span className='text-xs'>{text}</span> : text
        return (
          <ThreeDotButton.MenuItem key={key} className={menuItemClassName}>
            <button key={key} disabled={disabled} onClick={onClick} className='w-full'>
              {el}
            </button>
          </ThreeDotButton.MenuItem>
        )
      })}
    </ThreeDotButton>
  )
}
