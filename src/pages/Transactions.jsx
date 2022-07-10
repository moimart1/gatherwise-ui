import {
  Button,
  Code,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react'
import { Select } from 'chakra-react-select'
import { useEffect, useState } from 'react'
import { useSynchronizationService } from '../services/endpoints/synchronizations'
import { useTransactionService } from '../services/endpoints/transactions'

const author = 'Martin'

// Banque 30 décembre Costco
// Communauto 31 décembre

function splitShare(amount, count, precision = 2) {
  const values = []
  while (amount > 0 && count > 0) {
    let share = Math.ceil((amount * Math.pow(10.0, precision)) / count) / Math.pow(10.0, precision)

    amount -= share
    count--

    values.push(share)
  }

  return values
}

function DialogSplitwiseAdd({ isOpen, onClose, transaction, categories, groups, lastSelection, setLastSelection }) {
  const [members, setMembers] = useState(lastSelection?.members ?? [])
  const [error, setError] = useState('')
  const membersShares = splitShare(Math.abs(transaction.amount), members.length)
  const synchronizationService = useSynchronizationService()
  const transactionService = useTransactionService()

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Sync transaction</ModalHeader>
        <ModalCloseButton />
        <form
          p={4}
          onSubmit={(event) => {
            const { _id: transactionId } = transaction
            const formData = new FormData(event.currentTarget)
            event.preventDefault()

            const data = {
              transactionId,
              members: formData.getAll('memberId').map((memberId) => {
                return {
                  id: parseInt(memberId),
                  paid: parseFloat(formData.get(`paid-${memberId}`)),
                  owed: parseFloat(formData.get(`owed-${memberId}`)),
                }
              }),
              categoryId: parseInt(formData.get('categoryId')),
              groupId: parseInt(formData.get('groupId')),
            }

            synchronizationService
              .syncToSplitwise(data)
              .then(() => onClose(event))
              .catch((err) => {
                console.log(err)
                setError(String(err))
              })
          }}
        >
          <ModalBody>
            <div className='text-red-500'>{error}</div>
            <span>
              Add transaction <Code>{transaction.description}</Code> of {transaction.amount}$
            </span>
            <FormLabel>Splitwise category</FormLabel>
            <Select
              name='categoryId'
              options={categories}
              placeholder='Select the category...'
              closeMenuOnSelect={true}
              selectedOptionStyle='check'
              onChange={(category) => {
                setLastSelection({ ...lastSelection, category })
              }}
              defaultValue={lastSelection?.category}
            />
            <FormLabel>Splitwise group</FormLabel>
            <Select
              name='groupId'
              options={groups}
              placeholder='Select the group...'
              closeMenuOnSelect={true}
              selectedOptionStyle='check'
              onChange={(group) => {
                setLastSelection({ ...lastSelection, group })
                setMembers(group?.members ?? [])
                console.log(group?.members)
              }}
              defaultValue={lastSelection?.group}
            />
            <FormLabel>Splitwise members</FormLabel>
            <Select
              name='memberId'
              options={members}
              value={members}
              placeholder='Select members...'
              closeMenuOnSelect={false}
              isDisabled={!members?.length}
              isMulti={true}
              selectedOptionStyle='check'
              onChange={(members) => {
                setLastSelection({ ...lastSelection, members })
                setMembers(members ?? [])
              }}
              defaultValue={lastSelection?.members}
            />

            <div className='flex flex-col text-sm p-2'>
              {(members ?? []).map((member, idx) => {
                return (
                  <div key={idx} className={'flex flex-row w-full'}>
                    <div className='flex flex-row w-full px-2'>
                      <label htmlFor={`paid-${member.id}`} className={'m-auto'}>
                        Paid by {member.label}
                      </label>
                      <input
                        id={`paid-${member.value}`}
                        className={'h-8 border-gray-300 rounded m-auto'}
                        name={`paid-${member.value}`}
                        size={4}
                        type='number'
                        readOnly
                        value={Math.abs(idx == 0 ? transaction.amount : 0)} // First member author of transaction
                      />
                    </div>
                    <div className='flex flex-row w-full px-2'>
                      <label htmlFor={`owed-${member.id}`} className={'m-auto'}>
                        Owed by {member.label}
                      </label>
                      <div className='grow'></div>
                      <input
                        id={`owed-${member.value}`}
                        className={'h-8 border-gray-300 rounded m-auto'}
                        name={`owed-${member.value}`}
                        size={4}
                        type='number'
                        readOnly
                        value={membersShares[idx]}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              className='m-1'
              type='button'
              onClick={() => {
                transactionService.update(transaction._id, { reviewed: true }).then(() => {
                  onClose()
                })
              }}
            >
              Reviewed
            </Button>
            <Button className='m-1' type='submit'>
              Add
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

export default function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [context, setContext] = useState({})
  const [isLoading, setLoading] = useState(false)
  const [reloadTransaction, setReloadTransaction] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [focusedTransaction, setFocusedTransaction] = useState({})
  const [lastSelection, setLastSelection] = useState({})
  const transactionService = useTransactionService()
  const synchronizationService = useSynchronizationService()
  const trigReloadTransaction = () => setReloadTransaction(!reloadTransaction)

  // List transactions
  useEffect(() => {
    let mounted = true
    if (!transactionService.isReady) return

    transactionService.readAll({ limit: 20 }).then((data) => {
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
  }, [transactionService.isReady, reloadTransaction])

  // Get context
  useEffect(() => {
    let mounted = true
    setLoading(true)
    synchronizationService.getContext().then((data) => {
      if (mounted) {
        setLoading(false)
        setContext({
          categories: (data?.categories ?? []).reduce((categories, category) => {
            categories.push({
              label: category.name,
              options: (category?.subcategories ?? []).reduce((subcategories, subcategory) => {
                subcategories.push({
                  label: subcategory.name,
                  value: subcategory.id,
                })

                return subcategories
              }, []),
            })

            return categories
          }, []),
          // Groups //
          groups: (data?.groups ?? []).reduce((groups, group) => {
            groups.push({
              label: group.name,
              value: group.id,
              members: (group?.members ?? [])
                .reduce((members, member) => {
                  members.push({
                    label: `${member.first_name ? member.first_name : ''} ${member.last_name ? member.last_name : ''}`,
                    value: member.id,
                  })

                  return members
                }, [])
                .sort((x, y) => {
                  // Workaround to put author at the top // TODO hackish
                  return x.label.includes(author) ? -1 : y.label.includes(author) ? 1 : 0
                }),
            })

            return groups
          }, []),
        })
      }
    })

    return () => {
      mounted = false
    }
  }, [synchronizationService.isReady])

  return (
    <div className=''>
      {isLoading ? <span className='italic p-3'>Loading...</span> : <span></span>}
      {transactions &&
        Object.keys(transactions).map((transactionDate, index) => {
          return (
            <div key={`${index}`}>
              <h2 className='font-bold' key={`title-${index}`}>
                {transactionDate}
              </h2>
              <div className='max-w-md flex flex-col'>
                {transactions[transactionDate].map((transaction, index) => {
                  return (
                    <button
                      key={index}
                      className='border rounded m-3 p-2'
                      onClick={(event) => {
                        setFocusedTransaction(transaction)
                        onOpen(event)
                      }}
                    >
                      <div className='text-left'>
                        <div className=' font-bold'>{transaction.description}</div>
                        <div className='italic'>{transaction?.sync?.map((sync) => sync.outputName).join(', ')}</div>
                      </div>
                      <div className='text-right'>{transaction.amount}$</div>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      <DialogSplitwiseAdd
        isOpen={isOpen}
        onClose={() => {
          trigReloadTransaction()
          onClose()
        }}
        transaction={focusedTransaction}
        categories={context.categories}
        groups={context.groups}
        lastSelection={lastSelection}
        setLastSelection={setLastSelection}
      />
    </div>
  )
}
