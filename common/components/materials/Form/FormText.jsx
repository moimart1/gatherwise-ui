import { copyToClipboardOnAction } from '../../../libs/clipboard'
import { getValue } from '../../../libs/object'
import { classNames } from '../../../libs/style'
import { H2 } from '../Formatting'
import Table from '../Table'

export default function FormText({ name, description, disabled, dataKey, formData }) {
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
      <Table.Cell
        className={classNames('w-full justify-self-end whitespace-nowrap text-nowrap px-2 py-1', disabled && 'opacity-60')}
      >
        <div onDoubleClick={copyToClipboardOnAction({ copiedElement: 'Copied !' })}>{getValue(formData, dataKey)}</div>
      </Table.Cell>
    </Table.Row>
  )
}
