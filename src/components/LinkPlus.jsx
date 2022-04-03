import React from 'react'
import { Link } from 'react-router-dom'

export default function LinkPlus({ to, children, ...props }) {
  const isAbsoluteInternal = to.startsWith(window.location.origin)
  const isExternal = /^https?:\/\//.test(to) && !isAbsoluteInternal

  // Crop internal absolute url (Link doesn't support absolute url)
  to = isAbsoluteInternal ? to.substring(window.location.origin.length) : to
  return isExternal ? (
    <a href={to} {...props}>
      {children}
    </a>
  ) : (
    <Link to={to} {...props}>
      {children}
    </Link>
  )
}
