import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'

const VariantEnum = {
  green: 'green',
  red: 'red',
  yellow: 'yellow',
  blue: 'blue',
  gray: 'gray',
}

const globalClassName = 'flex items-center rounded-full text-center px-2 border min-w-fit'

export default function Chip({ variant, children, className, ...props }) {
  const [currentClassName, setClassName] = useState(className ?? '')

  useEffect(() => {
    switch (variant) {
      case VariantEnum.green:
        setClassName(`${globalClassName} ${className ?? ''} border-green-400 bg-green-50 text-green-500`)
        break
      case VariantEnum.red:
        setClassName(`${globalClassName} ${className ?? ''} border-red-400 bg-red-50 text-red-500`)
        break
      case VariantEnum.yellow:
        setClassName(`${globalClassName} ${className ?? ''} border-yellow-400 bg-yellow-50 text-yellow-500`)
        break
      case VariantEnum.blue:
        setClassName(`${globalClassName} ${className ?? ''} border-blue-400 bg-blue-50 text-blue-500`)
        break
      default:
        setClassName(`${globalClassName} ${className ?? ''} border-gray-400 bg-gray-50 text-gray-500`)
        break
    }
  }, [variant, className])

  return <span {...{ ...props, className: currentClassName }}>{children}</span>
}

Chip.propTypes = {
  variant: PropTypes.oneOf(Object.values(VariantEnum)),
  className: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
}

Chip.VariantEnum = VariantEnum
