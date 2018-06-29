export default {
  namespace: 'appState',
  state: {
    accountName: '',
    // 总投票数
    totalActivatedStake: 0,
    // 总投票 weight
    totalProducerVoteWeight: 0,
    // 总发行量
    totalSupply: 900000000,
    // 最大发行量
    maxSupply: 1000000000,
    // eos 价格
    eosPrice: 11.83,

    // producer sort
    sortType: 0,

    // bp 列表
    producers: [],
    // 已选择的 bp 列表
    selectedProducers: [],

    // 之前是否 投过票
    isVotedBefore: false,
    // 当前抵押的 Token 数量
    staked: 0,
    // 当前 Token balance
    balance: 0,
    // 上次投的 bp name 列表
    lastVotedProducerNames: [],
    // 上次投票时间
    lastedVoteTime: 0,
    // 上次赎回时间
    lastUnstakeTime: 0,
    // 赎回中的数量
    unstaking: 0,
    // 当前抵押
    delegatedStakeDetail: {
      stake_net_quantity: '0 EOS',
      stake_cpu_quantity: '0 EOS'
    },
    cpu_limit: {
      available: 1,
      max: 1,
      used: 0,
    },
    net_limit: {
      available: 1,
      max: 1,
      used: 0,
    },
    // refund 列表
    refunds: [],
  },
  reducers: {
    update(state, action) {
      return { ...state, ...action.payload }
    }
  }
}
