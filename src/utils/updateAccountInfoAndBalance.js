import * as eosHelper from './eosHelper'
import { BigNumber } from 'bignumber.js';
const UPDATE_EVNET = 'appState/update'

export function updateAccountInfoAndBalance(accountName, dispatch) {
  const req1 = eosHelper.getBalance(accountName).then(balance => {
    dispatch({ type: UPDATE_EVNET, payload: { balance } })
  })

  const req2 = eosHelper.getAccountInfo(accountName).then(account => {
    const voteInfo = account.voter_info || {}
    // document.body.innerHTML = JSON.stringify(account.voter_info)

    let stakeObject = {
      stake_net_quantity: 0,
      stake_cpu_quantity: 0,
    }

    if (account.self_delegated_bandwidth) {
      stakeObject = {
        stake_net_quantity: parseFloat(account.self_delegated_bandwidth.net_weight || 0),
        stake_cpu_quantity: parseFloat(account.self_delegated_bandwidth.cpu_weight || 0),
      }
    }

    const staked = BigNumber(stakeObject.stake_net_quantity).plus(stakeObject.stake_cpu_quantity).toNumber()

    dispatch({
      type: UPDATE_EVNET, payload: {
        // isVotedBefore: voteInfo.producers && voteInfo.producers.length > 0,
        // 如果先前的投票已经赎回，当做未投票过来判断
        cpuLimit: account.cpu_limit,
        netLimit: account.net_limit,
        isVotedBefore: voteInfo.producers && voteInfo.producers.length,
        lastedVoteTime: localStorage.getItem('lastedVoteTime') || 0,
        staked: staked,
        lastVotedProducerNames: voteInfo.producers || [],
        lastUnstakeTime: voteInfo.last_unstake_time,
        unstaking: voteInfo.unstaking,
        delegatedStakeDetail: stakeObject,
      }
    })
  })

  const req3 = eosHelper.getRefund(accountName).then(res => {
    if (res && res.rows && res.rows.length) {
      dispatch({
        type: UPDATE_EVNET,
        payload: {
          refunds: res.rows,
        }
      })
    }
  })

  return Promise.all([req1, req2, req3])
}
