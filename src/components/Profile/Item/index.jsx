import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Modal from 'components/Common/Modal/Alert'
import styles from './index.css'
import i18n from 'i18n'

export default class Item extends React.Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    handleUnstake: PropTypes.func.isRequired,
  }

  static defaultProps = {
    data: {
      producerNames: [],
      staked: '0',
      time: 0,
      isUnstaking: false,
    },
    index: 0,
  }

  state = {
    visible: false,
  }

  render() {
    const { index, data } = this.props
    const itemClass = classNames({
      [styles.item]: true,
      [styles.odd]: index % 2 === 1
    })

    const labelClass = classNames({
      [styles.status]: true,
      [styles.success]: !data.isUnstaking,
    })

    const time = new Date(data.time).toLocaleString()

    return (
      <div className={itemClass}>
        <div>
          <div className={styles.top}>
            <div className={styles.votes}>{`${data.staked} EOS`}</div>
            {!data.isUnstaking && !data.producerNames.length ? null :
              <div className={labelClass}>{data.isUnstaking ? `${i18n.unstaking}` : `${i18n.successful}`}</div>
            }
          </div>
          {!!data.producerNames.length &&
            <div className={styles.bp}>{`${i18n.vote_for}：${data.producerNames.join('、')}`}</div>
          }
          {time &&
            <div className={styles.time}>{time}</div>
          }
        </div>
        {!data.isUnstaking &&
          <a className={styles.refund} onClick={this.handleClick}>{i18n.unstake}</a>
        }
        <Modal
          visible={this.state.visible}
          title={i18n.unstake}
          desc={i18n.unstake_to_your_account}
          cancelText={i18n.cancel}
          confirmText={i18n.confirm}
          onCancel={() => this.setState({ visible: false })}
          onConfirm={this.handleUnstake}
        />
      </div>
    )
  }

  handleClick = () => {
    this.setState({ visible: true })
  }

  handleUnstake = () => {
    this.setState({ visible: false })
    this.props.handleUnstake()
  }
}
