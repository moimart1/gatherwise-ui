export default jest.fn().mockImplementation((fn) => {
  let args, context

  const debounced = function () {
    context = this
    args = arguments

    return fn.apply(context, args)
  }

  debounced.clear = jest.fn()

  return debounced // In test don't wait for debounce
})
