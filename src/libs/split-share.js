export function splitShare(amount, count, precision = 2) {
  const values = []
  while (amount > 0 && count > 0) {
    let share = Math.floor((amount * Math.pow(10.0, precision)) / count) / Math.pow(10.0, precision)

    amount -= share
    count--

    // last share when share > amount
    values.push(share > amount ? (share + amount).toFixed(2) : share)
  }

  return values
}
