import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import styles from './index.css'
import checked from 'icon/checked.svg'
import uncheck from 'icon/uncheck.svg'

const checkboxIcons = {
  normal: uncheck,
  checked: checked,
  normal_disable: uncheck,
  checked_disable: checked,
}

export default class Checkbox extends React.Component {
  static propTypes = {
    style: PropTypes.string,
    icons: PropTypes.object,
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
    iconScale: PropTypes.number,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    style: '',
    icons: checkboxIcons,
    checked: false,
    disabled: false,
    iconScale: 1,
    onChange() { },
  }

  constructor(props) {
    super(props)

    this.state = {
      checked: props.checked,
    }
  }

  render() {
    const { disabled, style, icons, children, iconScale } = this.props
    const checked = this.state.checked

    const checkboxStyle = classNames({
      [styles.checkbox]: true,
      [style]: style,
    })

    let icon
    if (checked) {
      if (disabled) {
        icon = icons.checked_disable
      } else {
        icon = icons.checked
      }
    } else {
      if (disabled) {
        icon = icons.normal_disable
      } else {
        icon = icons.normal
      }
    }

    return (
      <a onClick={this.handleClick} className={checkboxStyle}>
        <img src={icon} className={styles.icon} style={{ transform: `scale(${iconScale})` }} />
        {children}
      </a>
    )
  }

  handleClick = (e) => {
    if (this.props.disabled) return

    const checked = !this.state.checked
    this.setState({ checked })
    this.props.onChange({
      target: { checked },
      stopPropagation() {
        e.stopPropagation()
      },
      preventDefault() {
        e.preventDefault()
      },
      nativeEvent: e.nativeEvent,
    })
  }
}
