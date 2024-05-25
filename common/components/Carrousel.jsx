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
    <div className='mx-auto w-full flex-grow py-1'>
      <div className='mx-auto w-full'>
        <div className='my-1'>
          <div className='mb-4 flex items-center justify-between'>
            <h2 className='font-sherif text-2xl font-medium'>{title}</h2>
            <div className=''>
              <button className='mx-1 cursor-pointer text-xl font-bold text-midnight' onClick={() => slide(-1 * scrollStep)}>
                <FontAwesomeIcon icon={faAngleLeft} />
              </button>
              <button className='mx-1 cursor-pointer text-xl font-bold text-midnight' onClick={() => slide(scrollStep)}>
                <FontAwesomeIcon icon={faAngleRight} />
              </button>
            </div>
          </div>
          <div
            // Hack to show component like Menu hidden by the Carrousel container
            style={{ paddingBottom: '200px', marginBottom: '-200px' }}
            ref={scroll}
            onScroll={scrollCheck}
            className='flex-no-wrap scrolling-touch flex items-start space-x-3 overflow-x-auto scrollbar-hide'
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
