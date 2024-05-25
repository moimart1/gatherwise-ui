import { faCircle, faCircleCheck } from '@fortawesome/pro-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Listbox, ListboxOption, ListboxOptions } from '@headlessui/react'
import React from 'react'

// Item API
//  - name: string, Display name
//  - key: string, Unique key as value
//  - selected: boolean, If true the item is shown as selected
//  - disabled: boolean, If true the item can be changed

export default function ({ items, onSelect, disabled, multiple }) {
  function handleSelect(value) {
    const item = items.find((el) => el.key === value)
    if (!item?.disabled) item.selected = !item?.selected

    onSelect && onSelect(item, items)
  }

  return (
    <div className='flex'>
      <div className='w-full'>
        <Listbox
          as='div'
          multiple={multiple ?? true}
          className='space-y-1'
          value={items?.find((el) => !!el?.selected) ?? null}
          onChange={(value) => handleSelect(value)}
          disabled={disabled}
        >
          {() => (
            <>
              <div className='relative'>
                <ListboxOptions
                  static
                  className='max-h-100 shadow-xs overflow-auto rounded-md py-1 text-base leading-6 focus:outline-none sm:text-sm sm:leading-5'
                >
                  {Array.isArray(items) &&
                    items.map((item) => {
                      const selected = !!item.selected
                      return (
                        <ListboxOption key={item?.key} disabled={item?.disabled} value={item?.key}>
                          {({ focus }) => (
                            <div
                              className={`${
                                focus ? 'bg-black text-white' : ''
                              } relative select-none py-2 pl-8 pr-4 ${item?.disabled ? '' : 'cursor-pointer'}`}
                            >
                              <span
                                className={`${selected ? 'font-semibold' : 'font-normal'} ${
                                  item?.disabled ? 'text-midnight-500' : ''
                                } block truncate`}
                              >
                                {item?.name}
                              </span>
                              {selected ?
                                <span
                                  className={`${
                                    item?.disabled ? 'text-midnight-500' : ''
                                  } absolute inset-y-0 left-0 flex items-center pl-1.5`}
                                >
                                  <FontAwesomeIcon className={``} icon={faCircleCheck} />
                                </span>
                              : <span
                                  className={`${
                                    item?.disabled ? 'text-midnight-500' : ''
                                  } absolute inset-y-0 left-0 flex items-center pl-1.5`}
                                >
                                  <FontAwesomeIcon className={``} icon={faCircle} />
                                </span>
                              }
                            </div>
                          )}
                        </ListboxOption>
                      )
                    })}
                </ListboxOptions>
              </div>
            </>
          )}
        </Listbox>
      </div>
    </div>
  )
}
