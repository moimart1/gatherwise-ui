import { faCheck, faChevronDown } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { classNames } from '../../../libs/style'

export default function Dropdown({ className, value, defaultValue, onChange, items }) {
  return (
    <Listbox value={value} defaultValue={defaultValue} onChange={onChange}>
      <div className='relative mt-1'>
        <ListboxButton
          className={classNames(
            className,
            'relative cursor-default bg-white py-2 pl-3 pr-10 text-left focus:border-midnight focus:outline-none sm:text-sm'
          )}
        >
          <span className='block truncate text-midnight'>{items[value]}</span>
          <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
            <FontAwesomeIcon icon={faChevronDown} />
          </span>
        </ListboxButton>
        <ListboxOptions className='absolute z-30 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
          {Object.entries(items).map(([key, name]) => (
            <ListboxOption
              key={key}
              className={({ focus }) =>
                `relative cursor-default select-none py-2 pl-10 pr-4 text-midnight ${focus ? 'bg-midnight-100' : ''}`
              }
              value={key}
            >
              {({ selected }) => (
                <>
                  <span className={classNames(selected && 'text-midnight')}>{name}</span>
                  {selected ?
                    <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-midnight'>
                      <FontAwesomeIcon icon={faCheck} />
                    </span>
                  : null}
                </>
              )}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  )
}
