import { customAlphabet } from 'nanoid'

// Gatherwise compliant:
//  - No special characters
//  - Only lower case (e.g Helm release name)
//  - No dash, to be use with namespace (e.g myname-<my ID>)
//  - 16 characters give enough possibilities https://zelark.github.io/nano-id-cc/
//    most of filed values have a max length of 36 characters
//    Leave 10 characters to append info (e.g myname-<my ID>)
const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz'
const nanoid = customAlphabet(alphabet, 16)

/**
 * Return a unique ID with following pattern: [a-z0-9]{16}
 * @returns Unique ID
 */
export default function uniqueId() {
  return nanoid()
}
