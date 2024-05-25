import Table from '../Table'

/**
 * Used when child of FormSection is not Form*
 * @param {Object} options
 */
export default function FormNone({ children }) {
  return (
    <Table.Row>
      <Table.Cell className={'font-normal'}>{children}</Table.Cell>
    </Table.Row>
  )
}
