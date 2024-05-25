export function setValue(obj, path, value) {
  if (!obj || !path) return
  var a = path.split('.')
  var o = obj
  while (a.length - 1) {
    var n = a.shift()
    if (!(n in o)) o[n] = {}
    o = o[n]
  }
  o[a[0]] = value
}

export function getValue(obj, path) {
  path = path.replace(/\[(\w+)\]/g, '.$1')
  path = path.replace(/^\./, '')
  var a = path.split('.')
  var o = obj
  while (a.length) {
    var n = a.shift()
    if (!(n in o)) return
    o = o[n]
  }
  return o
}
