import { faCircleCheck, faCircleInfo, faCircleXmark } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export const SnackBarSeverity = {
  Info: 'info',
  Success: 'success',
  Error: 'error',
}

const contextBySeverity = {
  [SnackBarSeverity.Info]: {
    text: 'text-blue-500',
    border: 'border-blue-500',
    icon: <FontAwesomeIcon size='lg' icon={faCircleInfo} />,
  },
  [SnackBarSeverity.Success]: {
    text: 'text-green-500',
    border: 'border-green-500',
    icon: <FontAwesomeIcon size='lg' icon={faCircleCheck} />,
  },
  [SnackBarSeverity.Error]: {
    text: 'text-red-500',
    border: 'border-red-500',
    icon: <FontAwesomeIcon size='lg' icon={faCircleXmark} />,
  },
}

export default function SnackBar({ severity, message = 'Ceci est un message.', onClose }) {
  const context = contextBySeverity[severity] ? contextBySeverity[severity] : contextBySeverity[SnackBarSeverity.Error]

  return (
    <div
      className={
        `mx-2 max-w-sm sm:mx-auto md:mb-5 md:mr-5 ` +
        `flex flex-row items-center justify-between rounded-lg bg-gray-50 p-3 font-medium leading-none shadow-lg ` +
        `text-sm ${context.text} border ${context.border}  whitespace-no-wrap`
      }
    >
      <div className='mr-2 inline-flex items-center'>{context.icon}</div>
      <p>{message}</p>
      <div className={`ml-2`}>
        <span
          className='item-center inline-flex flex-shrink-0 cursor-pointer justify-center p-1 leading-none'
          onClick={() => onClose && onClose()}
        >
          <FontAwesomeIcon size='lg' icon={'fa-solid fa-xmark'} />
        </span>
      </div>
    </div>
  )
}
