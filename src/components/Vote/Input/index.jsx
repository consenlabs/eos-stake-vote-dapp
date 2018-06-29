import React from 'react'
import PropTypes from 'prop-types'
import styles from './index.css'
import Checkbox from 'components/Common/Checkbox'
import i18n from 'i18n'

export default class Input extends React.Component {
  static propTypes = {
    balance: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    votes: PropTypes.number.isRequired,
    modify: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    balance: 0,
    onChange: () => { },
    votes: 0,
    modify: false,
  }

  state = {
    checked: false
  }

  render() {
    const { checked } = this.state
    const { balance, votes, modify } = this.props
    return (
      <div className={styles.wrap}>
        <div className={styles.addNew}>
          <Checkbox checked={checked} onChange={this.handleAddStake} style={styles.checkbox} iconScale={0.7}>
            <div className={styles.addNewText}>{i18n.add_stake}</div>
          </Checkbox>
        </div>
        {checked &&
          <div className={styles.form}>
            <div className={styles.info}>
              <div className={styles.name}>{'EOS'}</div>
              <div className={styles.balance}>{`${i18n.stakeable_balance}: ${balance}`}</div>
            </div>
            <div className={styles.inputWrap}>
              {/* {modify && <div className={styles.votes}>{votes}+</div>} */}
              <input type="number" placeholder={i18n.please_input_locked_amount} onChange={this.handleChange} className={styles.input} />
            </div>
          </div>
        }
      </div>
    )
  }

  handleAddStake = (e) => {
    const checked = e.target.checked
    this.setState({ checked })
    if (!checked) {
      this.props.onChange(0)
    }
  }

  handleChange = (e) => {
    this.props.onChange(e.target.value)
  }
}
