import { faFileLines } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'

dayjs.extend(LocalizedFormat)
const amount = new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' })

export function TransactionsTimeline({ data, onClickTransaction }) {
  const transactionsByDate = new Map()
  for (const transaction of data ?? []) {
    const date = dayjs(transaction.date).format('YYYY-MM-DD')
    if (!transactionsByDate.has(date)) {
      transactionsByDate.set(date, [])
    }

    transactionsByDate.get(date).push(transaction)
  }

  return (
    <div className='pl-16'>
      <ol className='relative border-l border-gray-200 dark:border-gray-700'>
        {Array.from(transactionsByDate).map(([date, transactions]) => {
          date = dayjs(date)
          return (
            <li key={`transactions-${date.format()}`} className='mt-2 mb-8 ml-6'>
              <div className='flex absolute -left-20'>
                <span className='relative w-16 mx-1 px-2 text-center'>
                  <div className='font-bold'>{date.format('DD')}</div> {date.format('MMM')}
                </span>
                <span className='w-4 h-4 drop-shadow bg-front rounded-full ring-4 ring-white dark:ring-gray-900 dark:bg-blue-900'></span>
              </div>
              <div className='space-y-2'>
                {transactions.map((transaction, index) => {
                  const transactionDate = dayjs(transaction.date)
                  return (
                    <div key={`transactions-${date.format()}-${index}`}>
                      <div
                        className='p-4 bg-white rounded-lg border border-gray-200 shadow-sm flex items-center cursor-pointer'
                        onClick={(event) => onClickTransaction && onClickTransaction(transaction, event)}
                      >
                        <div className='border border-gray-200 rounded w-8 h-8 mr-4 grid place-items-center'>
                          <FontAwesomeIcon icon={faFileLines} className={''} />
                        </div>
                        <div className='text-md font-bold text-back grow'>{transaction.description}</div>
                        <time className={`text-md font-normal ${transaction.amount > 0 ? 'text-green-700' : 'text-back'}`}>
                          {amount.format(transaction.amount)}
                        </time>
                      </div>
                      <span className='text-xs font-light text-gray-500 pl-3'>{transactionDate.format('LLL')}</span>
                    </div>
                  )
                })}
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
