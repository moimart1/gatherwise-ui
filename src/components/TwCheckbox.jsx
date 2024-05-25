import React, { useEffect, useState } from 'react'

const TwCheckbox = ({ checked, onClick }) => {
  const [isOn, setIsOn] = useState(checked)
  useEffect(() => {
    setIsOn(checked) // NOTE allows updating if
    // checked prop changes without click
  }, [checked])
  return (
    <span
      role='checkbox'
      aria-checked={isOn}
      tabIndex='0'
      onClick={() => {
        setIsOn(!isOn)
        onClick && onClick()
      }}
      className={`${isOn ? 'bg-gray-500' : 'bg-gray-200'} focus:shadow-outline relative inline-block
      h-6 w-11 flex-shrink-0 cursor-pointer
      rounded-full border-2 border-transparent
      transition-colors duration-200 ease-in-out
      focus:outline-none`}
    >
      <span
        aria-hidden='true'
        className={`${isOn ? 'translate-x-5' : 'translate-x-0'} inline-block h-5 w-5 transform rounded-full
        bg-white shadow transition duration-200 ease-in-out`}
      ></span>
    </span>
  )
}
export default TwCheckbox
