import Avatar from '@gatherwise/common-frontend-libs/components/Avatar'
import { copyToClipboardOnAction } from '@gatherwise/common-frontend-libs/libs/clipboard'
import { classNames } from '@gatherwise/common-frontend-libs/libs/style'

export default function UserTile({ className, disabledLabel, copiedLabel, username, firstName, lastName, onClick }) {
  let fullName = `${firstName ?? ''} ${lastName ?? ''}`.trim()
  // If not name, use the username as full name
  // Note: user needs to connect one time to set names
  fullName = fullName ? fullName : username

  return (
    <div className={className} onClick={onClick}>
      <div
        className={classNames(
          `flex flex-row items-center space-x-3`,
          onClick && 'cursor-pointer select-none decoration-midnight-500 hover:underline',
          disabledLabel && 'opacity-60'
        )}
      >
        <Avatar name={fullName} className='h-11 w-11 rounded-full bg-midnight-100 font-sans font-bold' />
        <span className='flex flex-col'>
          <span className='space-x-1'>
            <span>{fullName}</span>
            {disabledLabel && <span className='italic'>{disabledLabel}</span>}
          </span>
          <span
            className='select-none text-xs text-midnight-500'
            onDoubleClick={copyToClipboardOnAction({ copiedElement: copiedLabel })}
          >
            {username}
          </span>
        </span>
      </div>
    </div>
  )
}
