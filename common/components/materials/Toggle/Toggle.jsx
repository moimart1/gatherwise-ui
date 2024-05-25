import { classNames } from '../../../libs/style'

export default function Toggle({ disabled, name, value, onChange, children }) {
  return (
    <label className='inline-flex cursor-pointer items-center'>
      <input type='checkbox' name={name} checked={value} onChange={onChange} disabled={disabled} className='peer sr-only' />
      <div
        className={classNames(
          'relative h-6 w-11 bg-midnight-100',
          'peer rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-0 rtl:peer-checked:after:-translate-x-full ',
          "after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-midnight-500 after:bg-white after:transition-all after:content-['']",
          ' peer-checked:bg-midnight',
          disabled && 'opacity-60'
        )}
      ></div>
      <span className='ms-3 text-sm font-medium'>{children}</span>
    </label>
  )
}
