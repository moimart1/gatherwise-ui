// expiresIn should always be a number in seconds
// returns a string with the given number + s, e.g. 12 => '12s'
export const parseExpiresIn = (rawExpiresIn) => {
  if (typeof rawExpiresIn === 'number') {
    return `${rawExpiresIn}s`
  } else {
    throw new Error(`Unexpected expiresIn type received: ${rawExpiresIn}`)
  }
}

// Parse a navigator.userAgentString to get the user's platform
// FIXME: android strings may return Linux bc it could be 'Linux; Android 12;'
export const parseUserAgentString = (rawString) => {
  const supportedOSNames = ['Windows', 'macOS', 'Linux', 'Mac OS X']
  let userOs = 'UNSUPPORTED'
  supportedOSNames.forEach((osName) => {
    if (rawString.includes(osName)) userOs = osName
  })
  return userOs
}
