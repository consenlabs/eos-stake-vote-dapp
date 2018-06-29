import React from 'react'
import ReactModal from 'react-modal'

export default class Modal extends React.Component {
  render() {
    const { visible, style } = this.props
    return (
      <ReactModal
        isOpen={!!visible}
        contentLabel="Modal"
        ariaHideApp={false}
        style={{
          overlay: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
          },
          content: {
            position: 'initial',
            margin: '42px',
            padding: '24px',
            borderRadius: '14px',
            border: 'none',
            bottom: 'initial',
            overflow: 'auto',
            WebkitOverflowScrolling: 'touch',
            maxHeight: '460px',
          },
          ...style,
        }}
      >
        {this.props.children}
      </ReactModal>
    )
  }
}
