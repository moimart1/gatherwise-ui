import { forwardRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function getLink(to) {
  const isAbsoluteInternal = to.startsWith(window.location.origin)
  const isExternal = /^https?:\/\//.test(to) && !isAbsoluteInternal

  // Crop internal absolute url (Link doesn't support absolute url)
  return { link: isAbsoluteInternal ? to.substring(window.location.origin.length) : to, isExternal }
}

export function useNavigatePlus() {
  const navigate = useNavigate()

  return (to) => {
    const { link, isExternal } = getLink(to)
    if (isExternal) {
      window.location.href = link
    } else {
      navigate(link)
    }
  }
}

export default forwardRef((meta, ref) => {
  let { to, children, disabled, className = '', target, ...props } = meta
  if (disabled) {
    return (
      <div ref={ref} className={className} {...props}>
        {children}
      </div>
    )
  }

  const { link, isExternal } = getLink(to)
  return isExternal ?
      <a href={link} ref={ref} target={target ? target : '_blank'} rel='noreferrer' className={className} {...props}>
        {children}
      </a>
    : <Link to={link} ref={ref} className={className} target={target} {...props}>
        {children}
      </Link>
})
