import React, { useEffect, useState } from 'react'

export default function Editable({ text, type, placeholder, children, childRef, ...props }) {
  const [isEditing, setEditing] = useState(false)

  useEffect(() => {
    if (childRef && childRef.current && isEditing === true) {
      childRef.current.focus()
    }
  }, [isEditing, childRef])

  const handleKeyDown = (event, type) => {
    const { key } = event
    const keys = ['Escape', 'Tab']
    const enterKey = 'Enter'
    const allKeys = [...keys, enterKey]
    if ((type === 'textarea' && keys.indexOf(key) > -1) || (type !== 'textarea' && allKeys.indexOf(key) > -1)) {
      setEditing(false)
    }
  }

  return (
    <section {...props}>
      {isEditing ? (
        <div onBlur={() => setEditing(false)} onKeyDown={(e) => handleKeyDown(e, type)}>
          {children}
        </div>
      ) : (
        <div className={``} onClick={() => setEditing(true)}>
          <span className={`${text ? 'text-black' : 'text-gray-500'}`}>{text || placeholder || 'Editable content'}</span>
        </div>
      )}
    </section>
  )
}
