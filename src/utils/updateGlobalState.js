import * as eosHelper from './eosHelper'
const UPDATE_EVNET = 'appState/update'

export function updateGlobalState(dispatch) {
  return eosHelper.getGlobal().then(result => {
    dispatch({
      type: UPDATE_EVNET, payload: {
        totalActivatedStake: result.total_activated_stake,
        totalProducerVoteWeight: result.total_producer_vote_weight
      }
    })
  })
}
