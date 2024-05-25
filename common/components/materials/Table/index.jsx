import React, { cloneElement } from 'react'
import { classNames } from '../../../libs/style'

export default function Table({ className, children }) {
  return <table className={classNames(className, 'text-left')}>{children}</table>
}

Table.Head = ({ children }) => {
  return <thead>{children}</thead>
}

Table.HeadCell = ({ className, children }) => {
  return <th className={classNames(className, 'border-b border-midnight-100')}>{children}</th>
}

Table.Row = ({ children, className }) => {
  return (
    <tr className={className}>
      {React.Children.map(children, (child, idx) => {
        const isFirst = idx === 0
        return cloneElement(child, { ...child.props, className: classNames(child.props?.className, isFirst && 'font-bold') })
      })}
    </tr>
  )
}

Table.Body = ({ children }) => {
  const rowCount = React.Children.count(children)
  return (
    <tbody>
      {React.Children.map(children, (child, idx) => {
        if (!child) return // Not a HTML element
        const isLast = idx === rowCount - 1
        return cloneElement(child, {
          ...child.props,
          className: classNames(
            child.props?.className,
            // By default (if not 'border-0' show a bottom border except the last row)
            !isLast && !child.props?.className?.includes('border-0') && 'border-b border-midnight-100'
          ),
        })
      })}
    </tbody>
  )
}

Table.Cell = ({ children, className, ...props }) => {
  return (
    <td {...props} className={className}>
      {children}
    </td>
  )
}
