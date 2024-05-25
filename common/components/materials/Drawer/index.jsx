import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'
import React, { Fragment } from 'react'

export default function Drawer({ children, open, setOpen }) {
  return (
    <Transition show={open} as={Fragment}>
      <Dialog as='div' className='relative z-30 border-0 ring-0 focus:ring-0' onClose={() => setOpen(false)}>
        <div className='fixed inset-0 bg-midnight-100/30' />
        <div className='fixed inset-0 overflow-hidden'>
          <div className='absolute inset-0 overflow-hidden'>
            <div className='pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10'>
              <TransitionChild
                as={Fragment}
                enter='transform transition ease-in-out duration-100'
                enterFrom='translate-x-full'
                enterTo='translate-x-0'
                leave='transform transition ease-in-out duration-100'
                leaveFrom='translate-x-0'
                leaveTo='translate-x-full'
              >
                <DialogPanel className='pointer-events-auto relative w-screen max-w-md'>
                  <div className='absolute right-0 top-0 flex pr-2 pt-2'>
                    <button
                      type='button'
                      className='relative text-midnight ring-0 focus:outline-none focus:ring-0'
                      onClick={() => setOpen(false)}
                    >
                      <FontAwesomeIcon icon={'fa-solid fa-xmark'} />
                    </button>
                  </div>

                  <div className='flex h-full flex-col overflow-y-auto bg-white p-4 shadow'>{children}</div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
