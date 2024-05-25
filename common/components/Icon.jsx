import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function Icon({ className, look }) {
  if (!look) {
    return <></>
  } else if (typeof look === 'function') {
    const LookComponent = look
    return <LookComponent className={className} />
  } else if (look?.iconName || typeof look === 'string') {
    return (
      <div className={className}>
        <FontAwesomeIcon icon={look} className='h-full w-full' />
      </div>
    )
  }

  return <div>n/a</div>
}
