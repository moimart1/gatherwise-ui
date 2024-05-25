import { getValue } from '../../../libs/object'
import { classNames } from '../../../libs/style'
import { H2 } from '../Formatting'
import Input from '../Input'
import Table from '../Table'

export default function FormInput({ name, description, disabled, dataKey, formData, handleChange }) {
  return (
    <Table.Row className={''}>
      <Table.Cell className={'px-2'}>
        <label
          id={`${dataKey}-label`}
          className={classNames('md:whitespace-nowrap md:text-nowrap', disabled && 'opacity-60')}
          htmlFor={`${dataKey}-label`}
        >
          <H2>{name}</H2>
          {description && <span className='text-sm text-midnight-500'>{description}</span>}
        </label>
      </Table.Cell>
      <Table.Cell className={classNames('whitespace-nowrap text-nowrap px-2 py-1', disabled && 'opacity-60')}>
        <Input
          id={`${dataKey}-label`}
          className={'w-full lg:w-1/2'}
          name={dataKey}
          aria-label={dataKey}
          type='text'
          value={getValue(formData, dataKey)}
          onChange={handleChange}
          disabled={disabled}
        />
      </Table.Cell>
    </Table.Row>
  )
}
