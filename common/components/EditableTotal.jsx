import { useState } from 'react'
import { classNames } from '../libs/style'
import Editable from './Editable'

const defaultValue = '∞'

export default function EditableTotal({ className, toggleEditing, onEdited, onChange, count, defaultTotal }) {
  const [total, setTotal] = useState(defaultTotal ?? defaultValue)

  return (
    <div
      className={classNames(
        className,
        count === total - 1 ? 'text-orange-500' : '',
        count >= total ? 'text-red-600' : '',
        'flex flex-row space-x-1'
      )}
    >
      <span>{`${count ?? defaultValue} /`}</span>
      <Editable
        text={`${total ?? defaultValue}`}
        toggleEditing={toggleEditing}
        onEdited={() => {
          setTotal((previous) => {
            // Trick to get up to date total
            if (String(total) !== String(previous)) onEdited && onEdited(parseInt(previous))
            return previous // Don't update state
          })
        }}
        className={'cursor-pointer'}
      >
        <input
          className={'h-5 w-14 border-0 p-0 px-1 text-sm ring-1 ring-gray-100 focus:ring-1 focus:ring-gray-300'}
          type='number'
          min='0'
          value={String(total)}
          onChange={(e) => {
            const value = parseInt(e.target.value)
            setTotal(isNaN(value) ? defaultValue : value)
            onChange && onChange(value)
          }}
        />
      </Editable>
    </div>
  )
}
