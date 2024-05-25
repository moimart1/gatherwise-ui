import { copyToClipboardOnAction } from '../../../libs/clipboard'
import { useLocalize } from '../../../libs/localization'
import { H1 } from '../Formatting'
import Table from '../Table'

export function DescriptionWithId({ description, id }) {
  const localize = useLocalize()
  return (
    <span className='block'>
      {description + ' '}
      <pre className='inline-block italic' onDoubleClick={copyToClipboardOnAction({ copiedElement: `${localize('copied')} !` })}>
        {id}
      </pre>
    </span>
  )
}

export default function FormSection({ title, description, children }) {
  return (
    <div className='space-y-4 px-0 md:px-2'>
      <span className='space-y-2'>
        <H1>{title}</H1>
        {description && <span>{description}</span>}
      </span>
      <div className='w-full overflow-y-auto px-0 md:px-4'>
        <Table className='w-full items-center space-y-3'>
          <Table.Body>{children}</Table.Body>
        </Table>
      </div>
    </div>
  )
}
