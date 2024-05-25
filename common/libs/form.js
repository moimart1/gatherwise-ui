import { useState } from 'react'
import { setValue } from './object'

/**
 * @param {Object} initial Initial Data
 * @returns {{formData:Object, setFormData:React.Dispatch<Object>, handleChange: (e:any) => void}}
 */
export function useFormData(initial) {
  const [formData, setFormData] = useState(initial)
  const handleChange = (event) => {
    if (!event?.target) return
    setFormData((previous) => {
      setValue(previous, event.target.name, event.target.value)
      if (event.target?.type === 'checkbox') {
        setValue(previous, event.target.name, event.target?.checked)
      }

      // Create new object
      return { ...previous }
    })
  }

  return { formData, setFormData, handleChange }
}
