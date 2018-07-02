import Eos from 'eosjs'
import { isOldVersion } from 'utils/checkVersion'

/**
 *
 * @param {string} provider
 */
export function setProvider(provider, chainId) {
  const eos = Eos({
    httpEndpoint: provider,
    broadcast: false,
    sign: false,
    expireInSeconds: 180,
    chainId: chainId,
  })
  window.eos = eos
  return eos
}

/**
 * Fetch account balance
 * https://github.com/EOSIO/eosjs-api/blob/master/src/api/v1/chain.json#L2
 * @param {string} accountName
 */
export function getBalance(accountName) {
  return window.eos.getCurrencyBalance('eosio.token', accountName, 'EOS').then(res => {
    if (res.length > 0) {
      return parseFloat(res[0])
    } else {
      return 0
    }
  })
}

/**
 * Fetch eos global info
 * https://github.com/EOSIO/eosjs-api/blob/master/src/api/v1/chain.json#L43
 *
 *{
      "server_version" : "string",
      "head_block_num" : "uint32",
      "last_irreversible_block_num" : "uint32",
      "last_irreversible_block_id" : "block_id",
      "head_block_id" : "block_id",
      "head_block_time" : "time_point_sec",
      "head_block_producer" : "account_name",
      "virtual_block_cpu_limit" : "uint64",
      "virtual_block_net_limit" : "uint64",
      "block_cpu_limit" : "uint64",
      "block_net_limit" : "uint64"
    }
 * }
 */
export function getChainInfo() {
  return window.eos.getInfo({}).then(result => {
    return result
  })
}

/**
 * Stake token and vote
 * @param {string} accountName
 * @param {Array} producers
 * @param {number} stake_net_quantity
 * @param {number} stake_cpu_quantity
 * @param {function} cb
 */
export function delegatebwAndVote(accountName, producers, stake_net_quantity, stake_cpu_quantity, onlyVoteProducer, cb) {
  if (isOldVersion()) {
    return __old_delegatebwAndVote(accountName, producers, stake_net_quantity, stake_cpu_quantity, cb)
  }

  const payload = {
    // pay info for preview display
    payinfo: {
      from: accountName,
      to: accountName,
      amount: onlyVoteProducer ? 0 : Number(stake_net_quantity) + Number(stake_cpu_quantity),
      orderInfo: 'EOS Vote'
    }
  }

  // vote

  // sort by character's Unicode code point value
  const sortedProducers = producers.sort()
  payload.actions = [
    {
      name: 'voteproducer',
      params: [accountName, '', sortedProducers]
    }
  ]

  // add delegatebw
  if (!onlyVoteProducer) {
    payload.actions.unshift({
      name: 'delegatebw',
      params: [{
        from: accountName,
        receiver: accountName,
        stake_net_quantity: `${stake_net_quantity} EOS`,
        stake_cpu_quantity: `${stake_cpu_quantity} EOS`,
        transfer: 0,
        memo: 'vote by imToken',
      }]
    })
  }

  window.imToken.callAPI('eos.transactions', payload, cb)
}

/**
 * Unstake tokens from CPU and bandwidth
 * @param {*} accountName
 * @param {*} stake_net_quantity
 * @param {*} stake_cpu_quantity
 * @param {*} cb
 */
export function undelegatebw(accountName, stake_net_quantity, stake_cpu_quantity, cb) {

  if (isOldVersion()) {
    return __old_undelegatebw(accountName, stake_net_quantity, stake_cpu_quantity, cb)
  }

  const payload = {
    // pay info for preview display
    payinfo: {
      from: accountName,
      to: accountName,
      amount: '0',
      orderInfo: 'EOS Unstake'
    },
    // undelegatebw action
    actions: [
      {
        name: 'undelegatebw',
        params: [{
          from: accountName,
          receiver: accountName,
          unstake_net_quantity: `${stake_net_quantity} EOS`,
          unstake_cpu_quantity: `${stake_cpu_quantity} EOS`,
        }]
      }
    ]
  }

  window.imToken.callAPI('eos.transactions', payload, cb)
}

/**
 * https://github.com/EOSIO/eosjs-api/blob/master/src/api/v1/chain.json#L72
 *
 * @param {string} accountName
 *
 * {
      "account_name": "name",
      "privileged": "bool",
      "last_code_update": "time_point",
      "created": "time_point",
      "ram_quota": "int64",
      "net_weight": "6000020000",
      "cpu_weight": 10000,
      "net_limit": "int64",
      "cpu_limit": {used: 109949, available: 6829567, max: 6939516},
      "ram_usage": "int64",
      "permissions": "vector<permission>",
      "total_resources": "variant",
      "delegated_bandwidth": {
        from: 'account_name',
        to: 'account_name',
        net_weight: '1200000000 SYS',
        cpu_weight: '0 SYS',

      },
      "voter_info": {  // https://github.com/EOSIO/eos/blob/8d111c45a47c4f528946d87f09ae9e18ae0f9a4d/contracts/eosio.system/eosio.system.hpp#L94
        owner: 'account_name',
        producers:  ['aaaaaa', 'eosio'],
        staked: '1200000000',           // 抵押中的 EOS, 没有 unit
        last_vote_weight: 'double',  // 上次投票的 weight
        deferred_trx_id: 'uint32_t', // 赎回的 txid
        last_unstake_time: 'time',   // 赎回时间
        unstaking: '0.0000 SYS'    // 赎回中,
      }
    }
 *
 */
export function getAccountInfo(accountName) {
  return window.eos.getAccount(accountName)
}

/**
 * https://github.com/EOSIO/eosjs-api/blob/master/src/api/v1/chain.json#L21
{
  last_claim_time : 0
  last_produced_block_time : 1161254627
  location : 0
  owner : "eoslaomao"
  producer_key : "EOS7ptfJfcHJQSU7vRbXBp96iANqtERMJznCeL7ZuKS9ThTvUNFHj"
  time_became_active : 1160639139
  total_votes : "587152805648837760.00000000000000000"
  unpaid_blocks : 64740
  url : "eoslaomao.com"
}
 */
export function getProducers() {
  return window.eos.getProducers({
    json: true,
  }).then(res => {
    return res.rows
  }).catch(e => {
    document.title = e.toString()
  })
}

/**
 * Fetch refund list
 * @param {string} accountName
 */
export function getRefund(accountName) {
  return window.eos.getTableRows({
    json: true,
    code: 'eosio',
    scope: accountName,
    table: 'refunds'
  })
}

/**
 *
 * {
  "rows": [
    {
      "max_block_net_usage": 1048576,
      "target_block_net_usage_pct": 1000,
      "max_transaction_net_usage": 524288,
      "base_per_transaction_net_usage": 12,
      "net_usage_leeway": 500,
      "context_free_discount_net_usage_num": 20,
      "context_free_discount_net_usage_den": 100,
      "max_block_cpu_usage": 200000,
      "target_block_cpu_usage_pct": 1000,
      "max_transaction_cpu_usage": 150000,
      "min_transaction_cpu_usage": 100,
      "max_transaction_lifetime": 3600,
      "deferred_trx_expiration_window": 600,
      "max_transaction_delay": 3888000,
      "max_inline_action_size": 4096,
      "max_inline_action_depth": 4,
      "max_authority_depth": 6,
      "max_ram_size": "68719476736",
      "total_ram_bytes_reserved": 1394748772,
      "total_ram_stake": 207197548,
      "last_producer_schedule_update": "2000-01-01T00:00:00.000",
      "last_pervote_bucket_fill": 0,
      "pervote_bucket": 0,
      "perblock_bucket": 0,
      "total_unpaid_blocks": 0,
      "total_activated_stake": "360514493788",
      "thresh_activated_stake_time": 0,
      "last_producer_schedule_size": 0,
      "total_producer_vote_weight": "1053189458552399104.00000000000000000",
      "last_name_close": "2000-01-01T00:00:00.000"
    }
  ],
  "more": false
}
 */
export function getGlobal() {
  return window.eos.getTableRows(true, 'eosio', 'eosio', 'global').then(res => {
    return res && res.rows && res.rows[0]
  })
}

// ----------------------------- for old code ---------------------------------

/**
 * Stake tokens for bandwidth and/or CPU and optionally transfer
 * @param {string} accountName
 * @param {Array} producers
 * @param {number} stake_net_quantity
 * @param {number} stake_cpu_quantity
 * @param {function} cb
 */
export function __old_delegatebwAndVote(accountName, producers, stake_net_quantity, stake_cpu_quantity, cb) {
  // sort by character's Unicode code point value
  const sortedProducers = producers.sort()

  const payload = [
    {
      name: 'delegatebw',
      params: [{
        from: accountName,
        receiver: accountName,
        stake_net_quantity: `${stake_net_quantity} EOS`,
        stake_cpu_quantity: `${stake_cpu_quantity} EOS`,
        transfer: 0,
        memo: 'vote from imToken',
      }]
    }, {
      name: 'voteproducer',
      params: [accountName, '', sortedProducers]
    }
  ]

  window.imToken.callAPI('eos.delegatebwAndVote', payload, cb)
}

/**
 * Unstake tokens from CPU and bandwidth
 * @param {*} accountName
 * @param {*} stake_net_quantity
 * @param {*} stake_cpu_quantity
 * @param {*} cb
 */
export function __old_undelegatebw(accountName, stake_net_quantity, stake_cpu_quantity, cb) {
  const payload = [
    {
      name: 'undelegatebw',
      params: [{
        from: accountName,
        receiver: accountName,
        unstake_net_quantity: `${stake_net_quantity} EOS`,
        unstake_cpu_quantity: `${stake_cpu_quantity} EOS`,
      }]
    }
  ]

  window.imToken.callAPI('eos.undelegatebw', payload, cb)
}



