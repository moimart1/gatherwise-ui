import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'

export const StatusVariantEnum = {
  success: 'success',
  error: 'error',
  warning: 'warning',
  info: 'info',
  unknown: 'unknown',
}

const globalClassName = 'rounded-full text-center py-1 px-2 border min-w-fit'

export default function Status({ variant, children, className, ...props }) {
  const [currentClassName, setClassName] = useState(className ?? '')

  useEffect(() => {
    switch (variant) {
      case StatusVariantEnum.success:
        setClassName(`${globalClassName} ${className ?? ''} border-green-400 bg-green-50 text-green-500`)
        break
      case StatusVariantEnum.error:
        setClassName(`${globalClassName} ${className ?? ''} border-red-400 bg-red-50 text-red-500`)
        break
      case StatusVariantEnum.warning:
        setClassName(`${globalClassName} ${className ?? ''} border-yellow-400 bg-yellow-50 text-yellow-500`)
        break
      case StatusVariantEnum.info:
        setClassName(`${globalClassName} ${className ?? ''} border-blue-400 bg-blue-50 text-blue-500`)
        break
      default:
        setClassName(`${globalClassName} ${className ?? ''} border-gray-400 bg-gray-50 text-gray-500`)
        break
    }
  }, [variant, className])

  return <span {...{ ...props, className: currentClassName }}>{children}</span>
}

Status.propTypes = {
  variant: PropTypes.oneOf(Object.values(StatusVariantEnum)),
  className: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
}
