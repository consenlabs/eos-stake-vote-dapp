import 'rc-slider/assets/index.css'
import React from 'react'
import Modal from 'components/Common/Modal/Modal'
import Button from 'components/Common/Button'
import Slider from 'rc-slider'
import styles from './index.css'


export default class Vote extends React.Component {
  constructor(props) {
    super(props)
    console.log(props)
    this.state = {
      value: props.defaultValue,
    }
  }

  // const createSliderWithTooltip = Slider.createSliderWithTooltip
  // const Range = createSliderWithTooltip(Slider)
  render() {

    const { visible, title, cancelText, confirmText, onCancel, onConfirm, defaultValue, } = this.props
    const { value } = this.state
    console.log(value, defaultValue)

    return (
      <Modal visible={visible}>
        <div className={styles.container}>
          <div className={styles.content}>
            <p className={styles.title}>{title}</p>
            <div className={styles.item}>
              <div>{value} EOS</div>
              <Slider
                min={0.0001}
                max={defaultValue}
                step={0.0001}
                handleStyle={[{
                  transform: 'scale(2.5)'
                }]}
                defaultValue={defaultValue}
                onChange={(v) => { this.setState({ value: v }) }}
              />
            </div>
          </div>

          <div className={styles.buttons}>
            <Button
              type="ghost"
              title={confirmText}
              onClick={() => {
                onConfirm(value)
              }}
              style={styles.confirm}
            />
          </div>
        </div>
      </Modal>
    )
  }
}


