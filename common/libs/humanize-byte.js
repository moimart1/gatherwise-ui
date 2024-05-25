/**
 * Convert bytes to human readable string
 * Examples:
 *  humanizeBytes(1024);       // 1 KB
 *  humanizeBytes('1024');     // 1 KB
 *  humanizeBytes(1234);       // 1.21 KB
 *  humanizeBytes(1234, 3);    // 1.205 KB
 * @param {number} bytes input bytes
 * @param {number} decimals number of decimals, two by default
 * @returns {string} Human readable bytes
 */
export function humanizeBytes(bytes, decimals = 2) {
  if (bytes == 0) return '0 Bytes'
  let k = 1024,
    dm = decimals ?? 2,
    sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}
