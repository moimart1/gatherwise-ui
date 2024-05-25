import Drawer from '.'
import { useLocalize } from '../../../libs/localization'
import { H1 } from '../Formatting'

export default function DrawerWithActions({ title, open, setOpen, ActionComponent, children }) {
  const localize = useLocalize()
  return (
    <Drawer open={open} setOpen={setOpen}>
      <div className='flex h-full flex-col px-2'>
        <H1>{localize(title)}</H1>

        <div className='flex h-full flex-col space-y-6 py-4'>
          {children}
          <div className='grow border-b'></div>
          <div className='flex flex-col space-y-3 py-3'>{ActionComponent}</div>
        </div>
      </div>
    </Drawer>
  )
}
