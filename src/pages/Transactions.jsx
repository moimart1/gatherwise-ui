import React, { useContext, useEffect, useState } from 'react'
import { LanguageContext } from '../libs/localization'
import transactionsService from '../services/endpoints/transactions'

export default function Transactions() {
  const lang = useContext(LanguageContext)
  const [transactionsRequest, states] = transactionsService.useReadAll()
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    let mounted = true
    if (!states.ready) return

    transactionsRequest({ limit: 20 }).then((data) => {
      if (mounted) {
        console.log(data)
        setTransactions(
          data.reduce((groups, transaction) => {
            const date = transaction.date.split('T')[0]
            if (!groups[date]) {
              groups[date] = []
            }
            groups[date].push(transaction)
            return groups
          }, {})
        )
      }
    })

    return () => {
      mounted = false
    }
  }, [states.ready])

  if (states.loading) return <div>Loading...</div>
  return (
    <div className=''>
      {transactions &&
        Object.keys(transactions).map((transactionDate, index) => {
          return (
            <>
              <h2 key={`titre-${index}`}>{transactionDate}</h2>
              <div className='max-w-md'>
                <ul key={`list-${index}`}>
                  {transactions[transactionDate].map((transaction, index) => {
                    return (
                      <div
                        key={index}
                        className='border rounded m-3 p-2 grip grid-cols-2'
                      >
                        <div className='text-left font-bold'>
                          {/* TODO add a modal to add to Splitwise */}
                          {transaction.description}
                        </div>
                        <div className='text-right'>{transaction.amount}$</div>
                      </div>
                    )
                  })}
                </ul>
              </div>
            </>
          )
        })}
    </div>
  )
}
