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
import React, { useEffect, useState } from 'react'
import syncService from '../services/endpoints/synchronizations'
import transactionsService from '../services/endpoints/transactions'

function ModalDialog({ isOpen, onClose, title, body, footer }) {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{body}</ModalBody>
          <ModalFooter>{footer}</ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

function DialogSplitwiseAdd({
  isOpen,
  onClose,
  transaction,
  categories,
  groups,
}) {
  const [members, setMembers] = useState([])
  const handleSubmit = (event) => {
    event.preventDefault()
    console.log(event.target[0])
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Sync transaction</ModalHeader>
        <ModalCloseButton />
        <form
          p={4}
          onSubmit={(event) => {
            const formData = new FormData(event.currentTarget)
            event.preventDefault()
            //console.log(event.currentTarget)
            const data = {
              ...transaction,
              members: formData.getAll('memberId').map((memberId) => {
                return {
                  id: memberId,
                  amount: formData.get(`amount-${memberId}`),
                }
              }),
              categoryId: formData.get('categoryId'),
              groupId: formData.get('groupId'),
            }

            console.log(data)
            //onClose(event)
          }}
        >
          <ModalBody>
            <span>
              Add transaction <Code>{transaction.description}</Code>
            </span>
            <FormLabel>Splitwise category</FormLabel>
            <Select
              name='categoryId'
              options={categories}
              placeholder='Select the category...'
              closeMenuOnSelect={true}
              selectedOptionStyle='check'
            />
            <FormLabel>Splitwise group</FormLabel>
            <Select
              name='groupId'
              options={groups}
              placeholder='Select the group...'
              closeMenuOnSelect={true}
              selectedOptionStyle='check'
              onChange={(value) => {
                setMembers(value?.members ?? [])
              }}
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
                setMembers(members ?? [])
              }}
            />

            <div className='flex flex-col text-sm p-2'>
              {(members ?? []).map((member, idx) => {
                return (
                  <div key={idx} className={'flex flex-row w-full'}>
                    <label htmlFor={`amount-${member.id}`} className={'m-auto'}>
                      Paid by {member.label}
                    </label>
                    <div className='grow'></div>
                    <input
                      id={`amount-${member.value}`}
                      className={'h-8 border-gray-300 rounded'}
                      name={`amount-${member.value}`}
                      size={4}
                      type='number'
                      readOnly
                      value={transaction.amount / members?.length ?? 1}
                    />
                  </div>
                )
              })}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button type='submit'>Add</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

export default function Transactions() {
  const [transactionsRequest, states] = transactionsService.useReadAll()
  const [transactions, setTransactions] = useState([])
  const [context, setContext] = useState({})
  const [isLoading, setLoading] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [focusedTransaction, setFocusedTransaction] = useState({})

  // List transactions
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

  // Get context
  useEffect(() => {
    let mounted = true
    setLoading(true)
    syncService.getContext().then((data) => {
      if (mounted) {
        setLoading(false)
        setContext({
          categories: (data?.categories ?? []).reduce(
            (categories, category) => {
              categories.push({
                label: category.name,
                options: (category?.subcategories ?? []).reduce(
                  (subcategories, subcategory) => {
                    subcategories.push({
                      label: subcategory.name,
                      value: subcategory.id,
                    })

                    return subcategories
                  },
                  []
                ),
              })

              return categories
            },
            []
          ),
          // Groups //
          groups: (data?.groups ?? []).reduce((groups, group) => {
            groups.push({
              label: group.name,
              value: group.id,
              members: (group?.members ?? []).reduce((members, member) => {
                members.push({
                  label: `${member.first_name ? member.first_name : ''} ${
                    member.last_name ? member.last_name : ''
                  }`,
                  value: member.id,
                })

                return members
              }, []),
            })

            return groups
          }, []),
        })
      }
    })

    return () => {
      mounted = false
    }
  }, [])

  if (states.loading) return <div>Loading...</div>
  return (
    <div className=''>
      {isLoading ? (
        <span className='italic p-3'>Loading...</span>
      ) : (
        <span></span>
      )}
      {transactions &&
        Object.keys(transactions).map((transactionDate, index) => {
          return (
            <>
              <h2 className='font-bold' key={`titre-${index}`}>
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
                      <div className='text-left font-bold'>
                        {/* TODO add a modal to add to Splitwise */}
                        {transaction.description}
                      </div>
                      <div className='text-right'>{transaction.amount}$</div>
                    </button>
                  )
                })}
              </div>
            </>
          )
        })}
      <DialogSplitwiseAdd
        isOpen={isOpen}
        onClose={onClose}
        transaction={focusedTransaction}
        categories={context.categories}
        groups={context.groups}
      />
    </div>
  )
}
