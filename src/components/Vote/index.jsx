import React from 'react'
import PropTypes from 'prop-types'
import Header from './Header'
import Input from './Input'
import Toast from 'components/Common/Toast'
import BPList from 'components/Common/BPList'
import styles from './index.css'

import * as eosHelper from '../../utils/eosHelper'
import tracker from '../../utils/tracker'
import { amountToStake } from '../../utils/eosAmountToStake'
import { updateAccountInfoAndBalance } from '../../utils/updateAccountInfoAndBalance'
import initApp from '../../initApp'
import { connect } from 'dva'
import { isOldVersion } from '../../utils/checkVersion'
import i18n from 'i18n'
import debounce from 'debounce'
import { BigNumber } from 'bignumber.js';

class Vote extends React.Component {
  static propTypes = {
    appState: PropTypes.object.isRequired,
  }

  static defaultProps = {
    appState: {},
  }

  constructor(props) {
    super(props)
    initApp(props)
    this.state = {
      votes: 0,
    }
    this.debounceVote = debounce(this.handleVote, 1000, true)
  }

  getStakeAbleBalance() {
    const { appState } = this.props
    const refunds = appState.refunds
    let refundBalance = BigNumber(0)
    if (refunds && refunds.length) {
      const refund = refunds[0]
      refundBalance = BigNumber(parseFloat(refund.net_amount)).plus(parseFloat(refund.cpu_amount))
    }
    const balance = refundBalance.plus(appState.balance)
    return balance.toFixed(4) * 1
  }

  render() {
    const { appState } = this.props
    const modify = !!appState.isVotedBefore
    const votes = appState.staked || 0
    const balance = this.getStakeAbleBalance()

    return (
      <div className={styles.bodyInner}>
        <Header modify={modify} appState={appState} />
        <Input modify={modify} onChange={this.handleInput} balance={balance} votes={Number(votes)} />
        <BPList appState={appState}
          onSelected={this.handleCheck}
          onSelected={this.handleCheck}
          disabled={true}
          onlyShowSelected={true}
        />
        {this.renderVoteButton()}
      </div>
    )
  }

  renderVoteButton() {
    const { staked, isVotedBefore } = this.props.appState
    const { votes } = this.state
    const totalVotes = BigNumber(Number(votes) || 0).plus(Number(staked) || 0).toNumber()
    return (
      <a className={styles.button} onClick={this.debounceVote}>
        <div className={styles.text}>{`${isVotedBefore ? i18n.modify_voting : i18n.vote} (${totalVotes} EOS)`}</div>
      </a>
    )
  }

  handleInput = (votes) => {
    this.setState({ votes })
  }

  handleVoteTacker = (event) => {
    const { votes } = this.state
    const { appState } = this.props
    const { staked } = appState
    const totalVotes = BigNumber(Number(votes) || 0).plus(Number(staked) || 0).toNumber()

    tracker.track(event, {
      totalVotes: totalVotes,
      votes: votes,
      accountName: appState.accountName,
      producers: appState.selectedProducers.map(pd => pd.meta.owner),
    })
  }

  handleVote = () => {
    const { appState, dispatch } = this.props
    const { votes } = this.state
    const balance = this.getStakeAbleBalance()

    if (votes != 0 && isNaN(Number(votes))) {
      Toast.show(i18n.invalid_amount)
      return false
    }

    if (+votes > +balance) {
      Toast.show(i18n.balance_not_enough)
      return false
    }

    if (votes < 0) {
      Toast.show(i18n.amount_less_than_zero)
      return false
    }

    if (isOldVersion() && +votes == 0) {
      Toast.show(i18n.amount_must_than_zero)
      return false
    }

    if (!appState.staked && +votes == 0) {
      Toast.show(i18n.must_staked_first)
      return false
    }

    if (!appState.selectedProducers.length) {
      Toast.show(i18n.no_producer_selected)
      return false
    }

    const stakedObject = amountToStake(Number(votes))
    const onlyVoteProducer = Number(votes) == 0

    this.handleVoteTacker('delegatebw_and_vote')

    eosHelper.delegatebwAndVote(
      appState.accountName,
      appState.selectedProducers.map(pd => pd.meta.owner),
      stakedObject.stake_net_quantity,
      stakedObject.stake_cpu_quantity,
      onlyVoteProducer,
      (err, result) => {
        if (err) {
          if (err.code != 1001) {
            Toast.show(`${i18n.vote_failed}: ${err.message}`)
            this.handleVoteTacker('delegatebw_and_vote_failed')
          } else {
            this.handleVoteTacker('delegatebw_and_vote_canceled')
          }
        } else {
          this.handleVoteTacker('delegatebw_and_vote_successful')
          Toast.show(i18n.vote_successful)
          localStorage.setItem('lastedVoteTime', Date.now())
          updateAccountInfoAndBalance(appState.accountName, dispatch)
          this.props.history.push('/profile')
        }
      }
    )
  }
}

export default connect(({ appState }) => ({ appState }))(Vote)
