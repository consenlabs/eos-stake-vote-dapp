import React from 'react'
// import PropTypes from 'prop-types'
import wallet from 'icon/wallet-eos.svg'
import styles from './index.css'
import i18n from 'i18n'

export default class Header extends React.Component {
  render() {
    const { appState } = this.props
    return (
      <div className={styles.header}>
        <img src={wallet} alt="wallet" className={styles.walletIcon} alt="wallet" />
        <div>
          <div className={styles.name}>{appState.accountName}</div>
          <div className={styles.info}>
            <div className={styles.balance}>{`${i18n.balance}: ${appState.balance} EOS`}</div>
            <div className={styles.voted}>{`${i18n.staked}: ${appState.staked} EOS`}</div>
          </div>
        </div>
      </div>
    )
  }
}
