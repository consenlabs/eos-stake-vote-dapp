import classnames from 'classnames'
import React from 'react'
import Notification from 'rmc-notification'

let messageInstance
const prefixCls = 'am-toast'

function getMessageInstance(
  mask,
  callback,
) {
  if (messageInstance) {
    messageInstance.destroy()
    messageInstance = null
  }
  Notification.newInstance(
    {
      prefixCls,
      style: {
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        left: 0,
        top: 0,
      },
      transitionName: 'am-fade',
      className: classnames({
        [`${prefixCls}-mask`]: mask,
        [`${prefixCls}-nomask`]: !mask,
      }),
    },
    notification => callback && callback(notification),
  )
}

function notice(
  content,
  type,
  duration = 3,
  onClose,
  mask = true,
) {
  const iconTypes = {
    info: '',
    success: 'success',
    fail: 'fail',
    offline: 'dislike',
    loading: 'loading',
  }
  const iconType = iconTypes[type]

  getMessageInstance(mask, notification => {
    messageInstance = notification

    notification.notice({
      duration,
      style: {},
      content: !!iconType ? (
        <div
          className={`${prefixCls}-text ${prefixCls}-text-icon`}
          role="alert"
          aria-live="assertive"
        >
          <div className={`${prefixCls}-text-info`}>{content}</div>
        </div>
      ) : (
        <div className={`${prefixCls}-text`} role="alert" aria-live="assertive">
          <div>{content}</div>
        </div>
      ),
      closable: true,
      onClose() {
        if (onClose) {
          onClose()
        }
        notification.destroy()
        notification = null
        messageInstance = null
      },
    })
  })
}
export default {
  SHORT: 3,
  LONG: 8,
  show(content, duration, mask) {
    return notice(content, 'info', duration, () => { }, mask)
  },
  info(
    content,
    duration,
    onClose,
    mask,
  ) {
    return notice(content, 'info', duration, onClose, mask)
  },
  success(
    content,
    duration,
    onClose,
    mask,
  ) {
    return notice(content, 'success', duration, onClose, mask)
  },
  fail(
    content,
    duration,
    onClose,
    mask,
  ) {
    return notice(content, 'fail', duration, onClose, mask)
  },
  offline(
    content,
    duration,
    onClose,
    mask,
  ) {
    return notice(content, 'offline', duration, onClose, mask)
  },
  loading(
    content,
    duration,
    onClose,
    mask,
  ) {
    return notice(content, 'loading', duration, onClose, mask)
  },
  hide() {
    if (messageInstance) {
      messageInstance.destroy()
      messageInstance = null
    }
  },
}
