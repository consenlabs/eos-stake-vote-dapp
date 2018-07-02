export default {
  namespace: 'appState',
  state: {
    accountName: '',
    totalActivatedStake: 0,
    totalProducerVoteWeight: 0,
    totalSupply: 900000000,
    maxSupply: 1000000000,
    eosPrice: 11.83,

    // producer sort
    sortType: 0,
    producers: [],
    selectedProducers: [],

    isVotedBefore: false,
    // Staked token amount
    staked: 0,
    // Token balance
    balance: 0,
    // Previous voted producers
    lastVotedProducerNames: [],
    // Previous vote time
    lastedVoteTime: 0,
    // Previous unstake timestamp
    lastUnstakeTime: 0,
    // Pending unstake amount
    unstaking: 0,
    // Current delegated resource
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
    refunds: [],
  },
  reducers: {
    update(state, action) {
      return { ...state, ...action.payload }
    }
  }
}
