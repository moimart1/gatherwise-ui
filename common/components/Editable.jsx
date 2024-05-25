import React, { useEffect, useRef, useState } from 'react'
import useClickOutside from '../hooks/useClickOutside'

export default function Editable({ text, placeholder, toggleEditing, onEdited, children, ...props }) {
  const trigEditingRef = useRef(false)
  const [isEditing, setEditing] = useState(false)
  const ref = useClickOutside(() => {
    setEditing((previous) => {
      if (trigEditingRef.current && previous) {
        // Was editing and was trigged: force false for next time
        trigEditingRef.current = false
      }

      if (trigEditingRef.current && !previous) {
        // Received a trigger and not editing
        return true // Force true
      } else if (previous) {
        // Editing
        onEdited && onEdited()
        return false // Force false
      }

      return previous
    })
  })

  useEffect(() => {
    if (toggleEditing === undefined) return // Not a toggle value
    trigEditingRef.current = true // Received a toggle: trig an editing
  }, [toggleEditing])

  return (
    <div ref={ref} {...props}>
      <div
        style={{ display: isEditing ? '' : 'none' }}
        onKeyDown={(e) => {
          if (e.key === 'Esc' || e.key === 'Escape') {
            setEditing(false)
          }
        }}
      >
        {children}
      </div>
      <div
        style={{ display: isEditing ? 'none' : '' }}
        onClick={() => {
          setEditing(true)
        }}
      >
        <span>{text || placeholder || ''}</span>
      </div>
    </div>
  )
}
