import { faSearch } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { forwardRef } from 'react'

export default forwardRef(
  ({ className, searchQuery, onSearchQuery, compact = false, placeholder = 'Search', autoFocus = true, onClick }, ref) => {
    let iconAdditionalClasses = 'top-4 left-4'
    let inputAdditionalClasses = 'h-12 px-10'

    if (compact) {
      iconAdditionalClasses = 'top-2 left-3'
      inputAdditionalClasses = 'h-8 px-8 text-sm'
    }

    return (
      <div onClick={onClick} className={className}>
        <div className='relative'>
          <form onSubmit={(input) => input.preventDefault()}>
            <FontAwesomeIcon className={`fa fa-search absolute text-midnight ${iconAdditionalClasses}`} icon={faSearch} />
            <input
              autoFocus={autoFocus}
              type='text'
              ref={ref}
              placeholder={placeholder}
              className={
                `w-full bg-white ` +
                `rounded-lg border-midnight focus:border-midnight-500 focus:outline-none focus:ring-midnight-500 ` +
                `hover:cursor-pointer ${inputAdditionalClasses}`
              }
              value={searchQuery}
              onInput={(e) => onSearchQuery(e.target.value)}
            />
          </form>
        </div>
      </div>
    )
  }
)

function isShown(query, tags) {
  const strTags = (tags ?? []).join(', ').toLowerCase()
  return !query || !!strTags.includes(query.toLowerCase())
}

export function SearchTags({ children, query, tags = [] }) {
  return isShown(query, tags) ? <>{children}</> : <></>
}

export function filterSearchTags(array, query, tagsGenerator) {
  return (array ?? []).filter((child, i) => {
    const tags = tagsGenerator && tagsGenerator(child, i)
    return isShown(query, tags) // Keep only tags to show
  })
}
