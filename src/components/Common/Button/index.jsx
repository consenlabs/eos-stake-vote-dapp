import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import styles from './index.css'

class Button extends React.Component {
  render() {
    const { type, title, onClick, disabled = false, style } = this.props
    const btnClass = classNames({
      [styles.button]: true,
      [styles.ghost]: type === 'ghost',
      [styles.grey]: type === 'grey',
      [styles.primary]: type === 'primary',
      [styles.second]: type === 'second',
      [styles.disabled]: disabled,
      [style]: style,
    })

    return (
      <button
        className={btnClass}
        onClick={onClick}
        disabled={disabled}
      >
        {title}
      </button>
    )
  }
}

Button.propTypes = {
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  type: PropTypes.string,
  style: PropTypes.string
}

export default Button
