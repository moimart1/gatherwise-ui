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
} from '@chakra-ui/react'
import { Select } from 'chakra-react-select'
import { useEffect, useRef, useState } from 'react'
import { splitShare } from '../libs/split-share'
import { useSynchronizationService } from '../services/endpoints/synchronizations'
import { useTransactionService } from '../services/endpoints/transactions'
import Editable from './Editable'

export default function DialogTransaction({ isOpen, onClose, transaction, categories, groups, lastSelection, setLastSelection }) {
  const [members, setMembers] = useState(lastSelection?.members ?? [])
  const [error, setError] = useState('')
  const [note, setNote] = useState('')
  const membersShares = splitShare(Math.abs(transaction.amount), members.length)
  const synchronizationService = useSynchronizationService()
  const transactionService = useTransactionService()
  const cleanThenClose = () => {
    setNote('')
    setError('')
    onClose()
  }

  const [description, setDescription] = useState(transaction.description)
  const descriptionRef = useRef()

  useEffect(() => {
    setDescription(transaction.description)
  }, [transaction])

  return (
    <Modal isOpen={isOpen} onClose={cleanThenClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Editable text={description} placeholder='Description' childRef={descriptionRef} type='input'>
            <input
              ref={descriptionRef}
              type='text'
              name='description'
              className='border rounded w-full py-2 px-3 text-gray-700 ring-0 focus:border-gray-300 focus:ring-0'
              placeholder='Write a task name 2'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Editable>
        </ModalHeader>
        <ModalCloseButton />
        <form
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
              note,
            }

            synchronizationService
              .syncToSplitwise(data)
              .then(() => cleanThenClose(event))
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
                        step='0.01'
                        defaultValue={Math.abs(idx == 0 ? transaction.amount : 0)} // First member author of transaction
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
                        step='0.01'
                        defaultValue={membersShares[idx]}
                      />
                    </div>
                  </div>
                )
              })}
              <div>
                <textarea
                  id='note'
                  cols={20}
                  rows={3}
                  className={'w-full'}
                  value={note}
                  onInput={(event) => setNote(event.target.value)}
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              className='m-1'
              type='button'
              onClick={() => {
                transactionService.update(transaction._id, { reviewed: true, note }).then(() => {
                  cleanThenClose()
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