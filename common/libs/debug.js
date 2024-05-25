export function getStack(depth = 3) {
  const stack = new Error().stack.split('\n')
  return stack.slice(1, 1 + depth)
}
