import React from 'react'
import PropTypes from 'prop-types'
import styles from './index.css'
import Item from '../Item'

export default class List extends React.Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired,
    handleUnstake: PropTypes.func.isRequired
  }

  static defaultProps = {
    data: [],
    handleUnstake: () => { }
  }

  render() {
    const { data } = this.props

    return (
      <div className={styles.list}>
        <div className={styles.title}>{this.props.title}</div>
        {data.map((d, i) => {
          return this.renderRow(d, i)
        })}
      </div>
    )
  }

  renderRow(data, index) {
    return (
      <Item data={data} index={index} key={index} handleUnstake={this.props.handleUnstake} />
    )
  }
}
