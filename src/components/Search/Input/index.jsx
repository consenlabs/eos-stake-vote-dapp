import React from 'react'
import PropTypes from 'prop-types'
import styles from './index.css'
import search from 'icon/search.svg'
import i18n from 'i18n'

export default class SearchInput extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
  }

  static defaultProps = {
    onChange: () => { },
    onCancel: () => { },
  }

  focusTextInput() {
    this.textInput.focus()
  }

  render() {
    const { onChange, onCancel, ...others } = this.props

    return (
      <div className={styles.search}>
        <div className={styles.inputWarp}>
          <input
            ref={(input) => { this.textInput = input }}
            type="text"
            placeholder={i18n.search}
            className={styles.searchInput}
            onChange={(e) => onChange(e.target.value)}
            {...others}
          />
          <img
            src={search}
            className={styles.iconSearch}
            alt="search"
          />
        </div>
        <a className={styles.cancel} onClick={onCancel}>{i18n.cancel}</a>
      </div>
    )
  }
}
