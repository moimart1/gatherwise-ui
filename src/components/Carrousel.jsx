import { faAngleLeft, faAngleRight } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useRef, useState } from 'react'

export default function Carrousel({ title, children, scrollStep = 50 }) {
  let scroll = useRef(null)
  const [scrollX, setScrollX] = useState(0)

  //Slide click
  const slide = (shift) => {
    scroll.current.scrollLeft += shift
    setScrollX(scrollX + shift)
  }

  const scrollCheck = () => {
    setScrollX(scroll.current.scrollLeft)
  }

  return (
    <div className='container px-4 flex-grow w-full py-1 sm:py-4 mx-auto px-0'>
      <div className='mx-auto w-full px-4'>
        <div className='container my-1'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-2xl font-medium'>{title}</h2>
            <div>
              <button className='cursor-pointer text-xl mx-1 text-gray-600 font-bold' onClick={() => slide(-1 * scrollStep)}>
                <FontAwesomeIcon icon={faAngleLeft} />
              </button>
              <button className='cursor-pointer text-xl mx-1 text-gray-600 font-bold' onClick={() => slide(scrollStep)}>
                <FontAwesomeIcon icon={faAngleRight} />
              </button>
            </div>
          </div>
          <div ref={scroll} onScroll={scrollCheck} className='flex flex-no-wrap overflow-x-auto scrolling-touch items-start mb-8'>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
