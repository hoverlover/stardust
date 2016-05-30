import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
// import $ from 'jquery'
import META from '../../utils/Meta'
import Icon from '../../elements/Icon/Icon'

export default class Message extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    dismissable: PropTypes.bool,
    header: PropTypes.string,
    icon: PropTypes.string,
  }

  // componentDidMount() {
  //   this.messageElm = $(this.refs.message)
  // }
  //
  handleDismiss = e => {
    // this.messageElm.transition('fade')
  }

  static _meta = {
    library: META.library.semanticUI,
    name: 'Message',
    type: META.type.collection,
  }

  render() {
    const classes = classNames(
      'sd-message',
      'ui',
      this.props.className,
      { icon: this.props.icon },
      'message'
    )

    const iconClasses = classNames(
      'sd-message-icon',
      this.props.icon
    )

    const closeIcon = <Icon className='sd-message-close-icon close' onClick={this.handleDismiss} />
    const header = <div className='sd-message-header header'>{this.props.header}</div>
    const icon = <Icon className={iconClasses} />

    // wrap children in <p> if there is a header
    const children = this.props.header ? <p>{this.props.children}</p> : this.props.children

    // wrap header and children in content if there is an icon
    const content = (
      <div className='sd-message-content content'>
        {this.props.header && header}
        {children}
      </div>
    )

    // prevent spreading icon classes as props on message element
    const messageProps = { ...this.props }
    delete messageProps.icon

    return (
      <div {...messageProps} className={classes} ref='message'>
        {this.props.dismissable && closeIcon}
        {this.props.icon && icon}
        {this.props.icon && content}
        {!this.props.icon && this.props.header && header}
        {!this.props.icon && this.props.children && children}
      </div>
    )
  }
}
