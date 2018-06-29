import React from 'react'
import styles from './index.css'
import List from './List'
import Header from './Header'
import { connect } from 'dva'
import initApp from '../../initApp'
import * as eosHelper from '../../utils/eosHelper'
import { updateAccountInfoAndBalance } from '../../utils/updateAccountInfoAndBalance'
import { amountToStake } from '../../utils/eosAmountToStake'
import SliderModal from './UnstakeSelected'
import Toast from 'components/Common/Toast'
import debounce from 'debounce'
import i18n from 'i18n'
import { BigNumber } from 'bignumber.js'

class Profile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      maxCpu: 0,
      maxNet: 0,
      defaultUnstakeValue: 0,
    }
    initApp(props)
    this.debounceUnstake = debounce(this.handleUnstake, 1000, true)
  }
  render() {
    const { appState } = this.props
    return (
      <div className={styles.wrap}>
        <Header appState={appState} />
        {this.renderOngoing()}
        {this.renderRefunds()}
        {this.renderNone()}
        {this.renderModal()}
      </div>
    )
  }

  renderNone() {
    const { appState } = this.props
    const producerNames = appState.lastVotedProducerNames || []
    if (!appState.staked && !producerNames.length && !appState.refunds.length) {
      return (
        <div className={styles.noVotes}>
          <div>{i18n.no_votes}</div>
        </div>
      )
    } else {
      return null
    }
  }

  renderOngoing() {
    const { appState } = this.props
    const producerNames = appState.lastVotedProducerNames || []
    if (!appState.staked && !producerNames.length) return null
    const data = [{
      staked: appState.staked,
      time: appState.lastedVoteTime * 1,
      producerNames: producerNames,
      isUnstaking: false
    }]
    const title = !!producerNames.length ? i18n.ongoing : i18n.staked
    return (
      <List title={title} data={data} handleUnstake={this.preUnstake} />
    )
  }

  renderRefunds() {
    const { appState } = this.props
    if (!appState.refunds.length) return null

    const data = appState.refunds.map(d => {
      const staked = BigNumber(parseFloat(d.net_amount)).plus(parseFloat(d.cpu_amount)).toNumber()
      return {
        staked: staked,
        time: d.request_time,
        producerNames: [],
        isUnstaking: true
      }
    })
    return (
      <List title={i18n.unstaking} data={data} />
    )
  }

  renderModal() {
    if (!this.state.visible) return null
    return <SliderModal
      visible={this.state.visible}
      defaultValue={this.state.defaultUnstakeValue}
      title={i18n.select_cpu_and_net}
      // cancelText={i18n.cancel}
      confirmText={i18n.confirm}
      onConfirm={this.handleSelectedConfirm}
    />
  }

  getMaxUnStakeValue = () => {
    const { appState } = this.props
    const stakedCpu = appState.delegatedStakeDetail.stake_cpu_quantity
    const stakedNet = appState.delegatedStakeDetail.stake_net_quantity
    const netLimit = appState.netLimit
    const cpuLimit = appState.cpuLimit
    const oneUsCpu = BigNumber(stakedCpu).dividedBy(cpuLimit.max)
    const oneKbNet = BigNumber(stakedNet).dividedBy(netLimit.max)

    const usedCpu = oneUsCpu.times(cpuLimit.used)
    const usedNet = oneKbNet.times(netLimit.used)
    const minCpu = oneUsCpu.times(15 * 1000)  // 10ms
    const minNet = oneKbNet.times(15 * 1000)  // 10kb

    return {
      cpu: BigNumber(stakedCpu).minus(usedCpu).minus(minCpu).toFixed(4) * 1,
      net: BigNumber(stakedNet).minus(usedNet).minus(minNet).toFixed(4) * 1
    }
  }


  preUnstake = () => {
    let { cpu, net } = this.getMaxUnStakeValue()

    this.setState({
      maxCpu: cpu,
      maxNet: net,
      defaultUnstakeValue: BigNumber(cpu).plus(net).toFixed(4) * 1,
      visible: true,
    })
    return false
  }

  handleSelectedConfirm = (value) => {
    this.setState({
      visible: false,
    })
    this.debounceUnstake(value)
  }

  handleUnstake = (value) => {
    const { appState, dispatch } = this.props
    const { defaultUnstakeValue, maxCpu, maxNet } = this.state
    let toReduceValue = BigNumber(defaultUnstakeValue).minus(value)

    let cpu = BigNumber(maxCpu)
    let net = BigNumber(maxNet)


    console.log(cpu, net)
    while (toReduceValue.isGreaterThan(0)) {


      console.log(toReduceValue)
      let harfReducer = BigNumber(toReduceValue.dividedBy(2).toFixed(4))
      if (toReduceValue.isEqualTo(0.0001)) {
        harfReducer = toReduceValue
      }

      const toCpu = cpu.minus(harfReducer)
      if (toReduceValue.isGreaterThan(0) && cpu.isGreaterThan(0) && toCpu.isPositive()) {
        cpu = toCpu
        toReduceValue = toReduceValue.minus(harfReducer)
      }

      const toNet = net.minus(harfReducer)
      if (toReduceValue.isGreaterThan(0) && net.isGreaterThan(0) && toNet.isPositive(0)) {
        net = toNet
        toReduceValue = toReduceValue.minus(harfReducer)
      }
    }

    cpu = cpu.toFixed(4) * 1
    net = net.toFixed(4) * 1
    console.log(cpu, net)

    if (cpu < 0 || net < 0) {
      if (cpu < 0) {
        return Toast.show(i18n.cpu_not_enough)
      }

      if (net < 0) {
        return Toast.show(i18n.net_not_enough)
      }
    }

<<<<<<< HEAD
=======
    this.handleUnstakeTracker('undelegatebw')
>>>>>>> 6561ef44fec05ba61547a53203c1f0d29519b7c2

    eosHelper.undelegatebw(
      appState.accountName,
      net > 0 ? net.toFixed(4) : 0,
      cpu > 0 ? cpu.toFixed(4) : 0,
      (err, result) => {
        if (err) {
          if (err.code != 1001) {
            Toast.show(err.message)
<<<<<<< HEAD
          } else {
          }
        } else {
=======
            this.handleUnstakeTracker('undelegatebw_falied')
          } else {
            this.handleUnstakeTracker('undelegatebw_canceled')
          }
        } else {
          this.handleUnstakeTracker('undelegatebw_successful')
>>>>>>> 6561ef44fec05ba61547a53203c1f0d29519b7c2
          Toast.show(i18n.unstake_successful)
          updateAccountInfoAndBalance(appState.accountName, dispatch)
        }
      }
    )
  }
<<<<<<< HEAD
=======

  handleUnstakeTracker = (event) => {
    const { appState } = this.props

    tracker.track(event, {
      votes: appState.delegatedStakeDetail.stake_net_quantity,
      accountName: appState.accountName,
      producers: appState.lastVotedProducerNames,
    })
  }
>>>>>>> 6561ef44fec05ba61547a53203c1f0d29519b7c2
}

export default connect(({ appState }) => ({ appState }))(Profile)
