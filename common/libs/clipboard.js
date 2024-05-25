/**
 * Copy the element text content to clipboard, can temporary replace by an element to give a visual feedback
 * @param {Object} options Options for copyToClipboardOnAction
 * @param {JSX.Element} options.copiedElement If provided the content is replaced by this temporary element
 * @param {JSX.Element} options.timeout If copiedElement is provided, it will be show during this timeout in ms
 * @returns
 */
export function copyToClipboardOnAction({ copiedElement, timeout = 800 } = {}) {
  let timeoutId = null
  return (event) => {
    navigator.clipboard.writeText(event?.target?.textContent)
    if (copiedElement && event?.target?.innerHTML && timeoutId === null) {
      const originalContent = event?.target?.innerHTML // Save original content
      event.target.innerHTML = copiedElement // Replace with temporary element
      timeoutId = setTimeout(() => {
        event.target.innerHTML = originalContent // Put back original content
        timeoutId = null
      }, timeout)
    }
  }
}
