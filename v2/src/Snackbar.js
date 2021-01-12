import React, { Component } from 'react';
import './Snackbar.css';
import { ReactComponent as Exclamation } from './exclamation.svg';
import { ReactComponent as X } from './x.svg';

class Snackbar extends Component {
  static defaultProps = {
    autoHideDuration: 5000,
    message: 'Default message',
  };

  constructor(props) {
    super(props);

    this.state = {
      shouldRender: props.isOpen,
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleAnimationEnd = this.handleAnimationEnd.bind(this);
  }

  componentDidMount() {
    const { close, autoHideDuration } = this.props;
    this.intervalID = setTimeout(() => {
      console.log('timeout');
      close();
    }, autoHideDuration);
  }

  componentDidUpdate(prevProps) {
    const { isOpen } = this.props;
    if (prevProps.isOpen !== isOpen && isOpen)
      this.setState({ shouldRender: true }); // eslint-disable-line
  }

  handleClick() {
    const { close } = this.props;
    clearTimeout(this.intervalID);
    close();
  }

  handleAnimationEnd() {
    const { isOpen } = this.props;

    if (!isOpen) this.setState({ shouldRender: false });
  }

  render() {
    const { close, message, isOpen } = this.props;
    const { shouldRender } = this.state;

    return (
      shouldRender && (
        <div
          className={`Snackbar ${isOpen ? 'fadeIn' : 'fadeOut'}`}
          onAnimationEnd={this.handleAnimationEnd}
        >
          <Exclamation className="Snackbar__icon" />
          <span className="Snackbar__message">{message}</span>
          <button
            className="Snackbar__btn"
            aria-label="Close notification"
            type="button"
            onClick={this.handleClick}
          >
            <X className="Snackbar__btn-close-icon" />
          </button>
        </div>
      )
    );
  }
}

export default Snackbar;
