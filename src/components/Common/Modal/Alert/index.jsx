import React from 'react'
import Modal from '../Modal'
import Button from '../../Button'
import styles from './index.css'

export default function Alert(props) {
  const { visible, title, desc, cancelText, confirmText, onCancel, onConfirm } = props
  return (
    <Modal visible={visible}>
      <div className={styles.container}>
        <div className={styles.content}>
          <p className={styles.title}>{title}</p>
          <p className={styles.desc}>{desc}</p>
        </div>

        <div className={styles.buttons}>
          <Button
            type="ghost"
            title={cancelText}
            onClick={onCancel}
            style={styles.cancel}
          />
          <Button
            type="ghost"
            title={confirmText}
            onClick={onConfirm}
            style={styles.confirm}
          />
        </div>
      </div>
    </Modal>
  )
}
