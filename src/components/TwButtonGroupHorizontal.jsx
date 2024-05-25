import React from 'react'

const TwButtonGroupHorizontal = ({ children, additionalClassName = '' }) => {
  if (!children) {
    console.error('TwButtonGroupHorizontal requires children button elements')
    return '???!'
  }

  return (
    <span className={`TwButtonGroupHorizontal relative inline-flex shadow-sm ${additionalClassName}`}>
      {React.Children.map(children, (child, i) => {
        return (
          !child ?
            '' // NOTE if child null or '' cannot clone
          : (
            (i === 0 && children?.length === 1) || !Array.isArray(children) // NOTE React
          ) ?
            // children is a special varaible that can use map,
            // but if only one item exists, it is not an array :-/
            React.cloneElement(child, {
              isHGroupSingleEl: true,
            })
          : i === 0 ?
            React.cloneElement(child, {
              isHGroupStartEl: true,
            })
          : i > 0 && children.length === 2 ?
            React.cloneElement(child, {
              isHGroupEndEl: true,
            })
          : i > 0 && i < children.length - 1 ?
            React.cloneElement(child, {
              isHGroupMiddleEl: true,
            })
          : React.cloneElement(child, {
              isHGroupEndEl: true,
            })
        )
      })}
    </span>
  )
}
export default TwButtonGroupHorizontal
