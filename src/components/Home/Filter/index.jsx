import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import styles from './index.css'
import search from 'icon/search.svg'
import i18n from 'i18n'

export default class Filter extends React.Component {
  static propTypes = {
    types: PropTypes.array.isRequired,
    onSelected: PropTypes.func.isRequired,
    sortType: PropTypes.number.isRequired,
  }

  static defaultProps = {
    types: [
      { name: i18n.sort_type_default, id: 0 },
      { name: i18n.sort_type_ranking, id: 1 },
      { name: i18n.sort_type_location, id: 2 }],
    onSelected: () => { },
    selected: 0,
  }

  constructor(props) {
    super(props)
    this.state = {
      selected: props.sortType,
    }
  }

  render() {
    return (
      <div className={styles.wrap}>
        {this.renderTypes()}
        {this.renderSearch()}
      </div>
    )
  }

  renderTypes() {
    const { types } = this.props
    const { selected } = this.state
    return (
      <div className={styles.types}>
        {types.map((type, index) => {
          const typeClass = classNames({
            [styles.type]: true,
            [styles.selected]: type.id === selected
          })
          return (
            <a key={index} className={typeClass} onClick={() => this.handleSelected(type)}>{type.name}</a>
          )
        })}
      </div>
    )
  }

  renderSearch() {
    return (
      <div className={styles.searchWrap}>
        <div className={styles.shadow}></div>
        <Link to="/search" className={styles.search} onClick={this.toSearch}>
          <img src={search} alt="search" className={styles.searchIcon} />
        </Link>
      </div>
    )
  }

  handleSelected = (type) => {
    this.props.onSelected(type)
    this.setState({ selected: type.id })
  }

  toSearch = () => {
    console.log('to search')
  }
}
