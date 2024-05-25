import { readFile, writeFile } from 'fs'

const args = process.argv.slice(2)
let headerPattern = '<!--'
headerPattern += '\n    ___ _____ _____ _                      '
headerPattern += '\n   |_  |_   _|_   _| |                     '
headerPattern += '\n     | | | |   | | | |__   __ _ ___  ___   '
headerPattern += "\n     | | | |   | | | '_ \\ / _` / __|/ _ \\  "
headerPattern += '\n /\\__/ /_| |_  | | | |_) | (_| \\__ \\  __/  '
headerPattern += '\n \\____/ \\___/  \\_/ |_.__/ \\__,_|___/\\___|  '
headerPattern += '\n'
headerPattern += '\n   version: {version} ({date})'
headerPattern += '\n'
headerPattern += '\n "If you see that, it\'s because you are awesome, please apply to secretcareers@{echo domainName}.com"'
headerPattern += '\n'
headerPattern += '\n-->'

readFile(args[0], function (err, buf) {
  if (err) {
    console.error(err)
    process.exit(1)
  }

  writeFile(
    args[0],
    headerPattern.replace('{version}', args[1]).replace('{date}', new Date().toUTCString()) + buf.toString(),
    function (
      err // ,data // NOTE unused var, silence no-unused-vars warning
    ) {
      if (err) {
        console.error(err)
        process.exit(1)
      }
    }
  )
})
