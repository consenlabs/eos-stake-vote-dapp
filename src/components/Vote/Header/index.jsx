import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import styles from './index.css'
import voteBox from 'icon/vote-box.svg'
import i18n from 'i18n'

const getNotices = (modify) => {
  return modify ? [i18n.allow_increase_votes, i18n.reselected_bp_will_overwrite_the_previously_selected] : [i18n.will_use_the_currently_locked_amount, i18n.if_failed_please_vote_again]
}

export default class Header extends React.Component {
  static propTypes = {
    appState: PropTypes.object.isRequired,
  }

  static defaultProps = {
    appState: {
      lastVotedProducerNames: [],
      staked: 0,
    }
  }

  render() {
    return (
      <div className={styles.header}>
        {this.renderModifyInfo()}
        {this.renderNotices()}
      </div>
    )
  }

  renderNotices() {
    const { modify } = this.props
    const notices = getNotices(modify)
    return (
      <div className={styles.content}>
        {!modify && <img src={voteBox} alt="vote box" />}
        <ul className={styles.ul}>
          {notices.map((desc, index) => {
            return (
              <li className={styles.li} key={index}>
                <div className={styles.dot}></div>
                <div>{desc}</div>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  renderModifyInfo() {
    const { modify, appState } = this.props

    // if (!modify) return null

    return (
      <div className={styles.info}>
        <div className={styles.voted}>
          <div className={styles.title}>{modify ? i18n.voted_info : i18n.staked}</div>
          {this.renderItem(appState, 0)}
        </div>
      </div>
    )
  }

  renderItem(data, index) {
    const { modify } = this.props

    const itemClass = classNames({
      [styles.item]: true,
      [styles.odd]: index % 2 === 1
    })
    return (
      <div className={itemClass}>
        <div>
          <div className={styles.top}>
            <div className={styles.votes}>{`${data.staked} EOS`}</div>
          </div>
          {modify &&
            <div className={styles.bp}>
              {`${i18n.vote_for}：${data.lastVotedProducerNames.join('、')}`}
            </div>
          }
        </div>
      </div>
    )
  }
}
