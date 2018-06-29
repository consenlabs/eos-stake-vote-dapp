import { BigNumber } from 'bignumber.js'

export function amountToStake(amount) {
  const pow = 10000
  const powAmount = amount * pow
  const half = Math.floor(powAmount / 2)
  const net = BigNumber(half).dividedBy(pow).toNumber()
  const cpu = BigNumber(half + (powAmount % 2)).dividedBy(pow).toNumber()
  return {
    stake_net_quantity: net.toFixed(4),
    stake_cpu_quantity: cpu.toFixed(4),
  }
}
