export function calculateVoteWeight() {
  let timestamp_epoch = 946684800000
  let dates = (Date.now() / 1000) - (timestamp_epoch / 1000)
  let weight = (dates / (86400 * 7)) / 52  //86400 = seconds per day 24*3600
  return Math.pow(2, weight)
}
