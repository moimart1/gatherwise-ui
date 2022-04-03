import PropTypes from 'prop-types'
import React from 'react'
import { NavLink } from 'react-router-dom'

const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ')
}
export default function AppBody({ children, title, subMenuMap }) {
  console.log(`[AppBody] loaded '${title}' with`, subMenuMap)
  return (
    <div className=''>
      <header className='bg-white shadow'>
        <div className='grid grid-cols-3 gap-4 content-center'>
          <div className='max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8'>
            <h2 className='text-2xl font-bold text-gray-900'>{title}</h2>
          </div>
          <div className='col-span-2 max-w-7xl m-auto'>
            {Array.isArray(subMenuMap) &&
              subMenuMap.map((item) => (
                <div key={`div-${item.path}`} className='px-1 inline-flex'>
                  <NavLink
                    end={['', '/'].includes(item.path)}
                    key={`path-${item.path}`}
                    to={`${item.basename ? item.basename + '/' : ''}${
                      item.path
                    }`}
                    className={({ isActive }) => {
                      return classNames(
                        isActive
                          ? 'border-gray-500 text-gray-900'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                        'inline-flex items-center px-1 pt-1 border-b-2 text-1xl'
                      )
                    }}
                  >
                    <span className=''>{item.title}</span>
                  </NavLink>
                </div>
              ))}
          </div>
        </div>
      </header>
      <main>
        <div className='max-w-7xl mx-auto py-3 sm:px-1 lg:px-2 bg-white'>
          <div className='mx-auto px-4 sm:px-1 lg:px-2'>{children}</div>
        </div>
      </main>
    </div>
  )
}

AppBody.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]).isRequired,
  title: PropTypes.string.isRequired,
}
