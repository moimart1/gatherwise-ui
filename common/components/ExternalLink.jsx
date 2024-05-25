import { faArrowUpRightFromSquare } from '@fortawesome/pro-light-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function ExternalLink({ to, children }) {
  return (
    <a href={to} target='_blank' className={'flex items-center space-x-2'} rel='noreferrer'>
      <span>{children}</span>
      <FontAwesomeIcon className='' icon={faArrowUpRightFromSquare} />
    </a>
  )
}
