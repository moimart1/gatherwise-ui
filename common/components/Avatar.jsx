const initialsRegex = new RegExp(/(\p{L}{1})\p{L}+/, 'gu')

export function nameInitials(name) {
  if (!name) return '' // Nothing more to do
  const initials = [...name.matchAll(initialsRegex)] || []

  return ((initials.shift()?.[1] || '') + (initials.pop()?.[1] || '')).toUpperCase()
}

/**
 * Get Avatar element base on the name of the user
 * @param {Object} options
 * @param {string} options.name Name of the user
 * @param {string} options.className CSS classes to apply
 * @returns {JSX.Element}
 */
export default function Avatar({ className, name }) {
  return (
    <div className={className}>
      <div className='relative inline-flex h-full w-full items-center justify-center overflow-hidden'>
        <span>{nameInitials(name)}</span>
      </div>
    </div>
  )
}
