import * as eosHelper from './utils/eosHelper'
import { getEosMarketInfo } from './utils/eosMarketInfo'
import { getProducers } from './utils/rpc'
import { updateAccountInfoAndBalance } from './utils/updateAccountInfoAndBalance'
import { updateGlobalState } from './utils/updateGlobalState'
import Toast from 'components/Common/Toast'
import i18n from 'i18n'
import { __debug } from './utils/debug'

const UPDATE_EVNET = 'appState/update'

export default (props) => {
  //---------- for debug --------//
  __debug()
  //---------- for debug end --------//

  if (window.imToken) {
    // boot your application
    initApp(props)
  } else {
    window.addEventListener('sdkReady', () => {
      initApp(props)
    })
  }
}

let inited = false

function initApp(props) {
  if (inited) return false
  inited = true

  const { dispatch } = props
  const provider = window.imToken.eosProvider
  const accountName = window.imToken.eosAccountName
  const chainId = window.imToken.eosChainId || 'a60111025a4a7a3655c8deb0b5d8354d7198a918370610ccfea444c6d1edeef0'

  if (!accountName) {
    return Toast.show(`account name ${i18n.switch_wallet}`, 20)
  }

  dispatch({
    type: UPDATE_EVNET, payload: {
      accountName: accountName
    }
  })

  eosHelper.setProvider(provider, chainId)

  getProducers().then(producers => {
    dispatch({ type: UPDATE_EVNET, payload: { producers } })
  }).catch(e => {
    Toast.show(`getProducers: ${e.message}`)
  })

  getEosMarketInfo().then(info => {
    dispatch({ type: UPDATE_EVNET, payload: { eosPrice: Number(info.quotes.USDT.price).toFixed(2) } })
  }).catch(e => {
    Toast.show(`getEosMarketInfo: ${e.message}`)
  })

  updateAccountInfoAndBalance(accountName, dispatch).catch(e => {
    Toast.show(`getAccount: ${e.message}`)
  })

  updateGlobalState(dispatch).catch(e => {
    Toast.show(`getGlobalState: ${e.message}`)
  })
}




