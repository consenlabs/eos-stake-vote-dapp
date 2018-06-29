import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import styles from './index.css'
import avatar from 'icon/wallet-eos.svg'
import i18n from 'i18n'

export default class Header extends React.Component {
  static propTypes = {
    appState: PropTypes.object.isRequired,
    headBlockNum: PropTypes.number
  }

  static defaultProps = {
    appState: {}
  }

  render() {
    return (
      <div className={styles.header}>
        {this.renderNavbar()}
        {this.renderProgress()}
      </div>
    )
  }

  renderNavbar() {
    return (
      <div className={styles.homeTop}>
        <Link to={`/profile`} className={styles.profileIcon}><img src={avatar} className={styles.avatar} alt="avatar" /></Link>
      </div>
    )
  }

  renderProgress() {
    const { appState, headBlockNum } = this.props
    const totalVotes = appState.totalActivatedStake ? parseInt(appState.totalActivatedStake / 10000, 10) : 0
    const percentage = (totalVotes / appState.maxSupply * 100).toFixed(2)

    return (
      <div className={styles.progressWrap}>
        <div className={styles.progress}>
          <div className={styles.progressTip} style={{ left: percentage }}>
            {`${i18n.progress}：${percentage}% | ${i18n.voted}: ${totalVotes}`}
          </div>
          <div className={styles.progressOuter}>
            <div className={styles.progressBar} style={{ width: `${percentage}%` }}></div>
          </div>
        </div>

        <div className={styles.statusInfo}>
          <div className={styles.statusItem}>
            <div className={styles.divider}></div>
            <div>
              <div className={styles.value}>{appState.eosPrice} USDT</div>
              <div className={styles.desc}>{i18n.eos_price}</div>
            </div>
          </div>
          <div className={styles.statusItem}>
            <div className={styles.divider}></div>
            <div>
              <div className={styles.value}>{headBlockNum || `...`}</div>
              <div className={styles.desc}>{`Block Height`}</div>
            </div>
          </div>
          <a href={`https://help-center.token.im/article/360005049833?locale=${i18n.lang}`} className={styles.rule}>{i18n.rules}</a>
        </div>
      </div>
    )
  }
}
