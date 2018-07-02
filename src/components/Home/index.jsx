import React from 'react'
import PropTypes from 'prop-types'
import Modal from 'components/Common/Modal/Alert'
import PureModal from 'components/Common/Modal/Modal'
import BPList from 'components/Common/BPList'
import Toast from 'components/Common/Toast'
import Button from 'components/Common/Button'
import Header from './Header'
import Filter from './Filter'
import styles from './index.css'

import * as eosHelper from '../../utils/eosHelper'
import tracker from '../../utils/tracker'
import initApp from '../../initApp'
import { connect } from 'dva'
import i18n from 'i18n'
import { updateGlobalState } from '../../utils/updateGlobalState'

class Home extends React.Component {
  static propTypes = {
    appState: PropTypes.object.isRequired,
  }

  static defaultProps = {
    appState: {},
  }

  constructor(props) {
    super(props)

    initApp(props)

    const { appState } = props
    this.state = {
      selected: appState.selectedProducers,
      headBlockNum: 0,
      visible: false,
      eventTip: true,
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { appState } = nextProps
    this.setState({
      selected: appState.selectedProducers,
    })
  }

  componentDidMount() {
    const { dispatch } = this.props

    setTimeout(() => {
      window.eos && this.updateChainInfo()
      tracker.track('eos_dapp_landing')
    }, 1000)

    this.globalInterval = setInterval(() => {
      if (window.eos && window.imToken) {
        updateGlobalState(dispatch).catch(e => { })
        this.updateChainInfo()
      }
    }, 5000)
  }

  updateChainInfo = () => {
    eosHelper.getChainInfo().then(res => {
      if (!this._unmounted) {
        this.setState({
          headBlockNum: res.head_block_num
        })
      }
    }).catch(e => { })
  }

  componentWillUnmount() {
    this.globalInterval && clearInterval(this.globalInterval)
    this._unmounted = true
  }

  render() {
    const { appState } = this.props
    const { headBlockNum } = this.state
    const { sortType } = appState

    return (
      <div className={styles.bodyInner}>
        <Header appState={appState} headBlockNum={headBlockNum} />
        <Filter onSelected={this.selectSortType} sortType={sortType} />
        {this.renderLoading()}
        <BPList
          appState={appState}
          onSelected={this.handleCheck}
        />
        {this.renderVoteButton()}
        {this.renderModal()}
        {/* {this.renderNotWorkModal()} */}
      </div>
    )
  }

  renderLoading() {
    const { appState } = this.props
    const { producers } = appState
    if (!producers.length) {
      return (
        <div className={styles.bpLoading}>{i18n.bp_loading}</div>
      )
    } else {
      return null
    }
  }

  renderVoteButton() {
    const { selected } = this.state
    return (
      <div className={styles.buttonWrap}>
        <a className={styles.button} onClick={this.handleVote}>
          <div className={styles.text}>{i18n.to_vote}</div>
          <div className={styles.selected}>{selected.length}</div>
        </a>
      </div>
    )
  }

  renderModal() {
    return (
      <Modal
        visible={this.state.visible}
        title={i18n.tip}
        desc={i18n.the_account_has_already_voted}
        cancelText={i18n.cancel}
        confirmText={i18n.modify_voting}
        onCancel={() => this.setState({ visible: false })}
        onConfirm={this.handleConfirm}
      />
    )
  }

  renderNotWorkModal() {
    return (
      <PureModal
        visible={this.state.eventTip}
        title={i18n.tip}
        desc={i18n.the_account_has_already_voted}
      >
        <div className="eventTip">
          <div className="eventTitle">{i18n.event_title}</div>
          <p>{i18n.event_p1}</p>
          <p>{i18n.event_p2}</p>
        </div>
        <div className={styles.buttons}>
          <Button
            type="ghost"
            title={i18n.understood}
            onClick={() => {
              this.setState({ eventTip: false })
            }}
            style={styles.confirm}
          />
        </div>
      </PureModal>
    )
  }

  selectSortType = (type) => {
    this.props.dispatch({
      type: 'appState/update', payload: {
        sortType: type.id
      }
    })
  }

  handleCheck = (bp, selected) => {
    if (selected.length > 30) {
      Toast.show(i18n.producers_num_limit)
      return
    }
    this.setState({ selected })
    this.props.dispatch({
      type: 'appState/update', payload: {
        selectedProducers: selected
      }
    })
  }

  handleVote = () => {
    const selected = this.state.selected
    const { isVotedBefore } = this.props.appState
    if (!selected.length) {
      return Toast.show(i18n.no_producer_selected)
    }
    if (isVotedBefore) {
      this.setState({ visible: isVotedBefore })
    } else {
      this.handleConfirm()
    }
  }

  handleConfirm = () => {
    this.props.history.push('/vote')
  }
}

export default connect(({ appState }) => ({ appState }))(Home)
