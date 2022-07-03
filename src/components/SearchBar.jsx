import { faSearch } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

export default function SearchBar({ searchQuery, onSearchQuery }) {
  return (
    <div className='relative'>
      <form onSubmit={(input) => console.log(input)}>
        <FontAwesomeIcon className='absolute fa fa-search text-gray-400 top-4 left-4' icon={faSearch} />
        <input
          type='text'
          placeholder='Search'
          className='bg-white h-12 w-full px-10 border-gray-400 rounded-lg focus:outline-none focus:border-gray-500 focus:ring-gray-500 hover:cursor-pointer'
          value={searchQuery}
          onInput={(e) => onSearchQuery(e.target.value)}
        />
      </form>
    </div>
  )
}

export function SearchTags({ children, query, tags }) {
  const strTags = tags.join(', ').toLowerCase()
  return !query || !!strTags.includes(query.toLowerCase()) ? <>{children}</> : <></>
}
