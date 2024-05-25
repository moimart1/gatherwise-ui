import React, { useState } from 'react'

export default function MoreList({ children, moreComponent, initialCount = 5 }) {
  const [showMore, setShowMore] = useState(false)
  const childrenComponents = React.Children.toArray(children)

  return (
    <>
      {childrenComponents.slice(0, showMore ? childrenComponents.length : initialCount)}
      <a
        className={`cursor-pointer ${childrenComponents.length <= initialCount ? 'hidden' : ''}`}
        onClick={() => {
          setShowMore((previous) => !previous)
        }}
      >
        {moreComponent && moreComponent({ showMore })}
      </a>
    </>
  )
}
