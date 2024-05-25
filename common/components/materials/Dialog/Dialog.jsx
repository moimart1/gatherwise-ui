import { DialogPanel, DialogTitle, Dialog as HeadlessDialog } from '@headlessui/react'
import { H1 } from '../Formatting'

export default function Dialog({ title, children, ActionComponent, open, onClose }) {
  return (
    <HeadlessDialog as='div' className='relative z-10' open={open} onClose={onClose}>
      <div className='fixed inset-0 bg-midnight-100/50' />

      <div className='fixed inset-0 overflow-y-auto'>
        <div className='flex min-h-full items-center justify-center'>
          <DialogPanel className='w-full max-w-lg overflow-hidden rounded-xl bg-white px-4 py-2 text-left align-middle shadow-xl'>
            <DialogTitle as={H1}>{title}</DialogTitle>
            <div className='my-4'>{children}</div>
            <div className='mb-2 flex flex-row justify-end space-x-2'>{ActionComponent}</div>
          </DialogPanel>
        </div>
      </div>
    </HeadlessDialog>
  )
}
