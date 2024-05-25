import { faAngleLeft, faAngleRight } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function ButtonsPrevNext({ className, previousDisabled, nextDisabled, onPrevious, onNext }) {
  let previousClassNames = previousDisabled ? 'opacity-60' : 'cursor-pointer hover:bg-gray-50'
  const nextClassNames = nextDisabled ? 'opacity-60' : 'border-l cursor-pointer hover:bg-gray-50'

  // Manage separation between buttons
  if ((previousDisabled && nextDisabled) || (!previousDisabled && nextDisabled)) previousClassNames += ' border-r'

  return (
    <div className={`flex flex-row ${className}`}>
      <div
        className={`rounded-l border-y border-l border-inherit px-3 py-1 ${previousClassNames}`}
        onClick={() => {
          if (!previousDisabled && onPrevious) onPrevious()
        }}
      >
        <FontAwesomeIcon icon={faAngleLeft} />
      </div>
      <div
        className={`rounded-r border-y border-r border-inherit px-3 py-1 ${nextClassNames}`}
        onClick={() => {
          if (!nextDisabled && onNext) onNext()
        }}
      >
        <FontAwesomeIcon icon={faAngleRight} />
      </div>
    </div>
  )
}
