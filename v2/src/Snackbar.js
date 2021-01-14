import React, { Component } from 'react';
import './Snackbar.css';
import { ReactComponent as Exclamation } from './exclamation.svg';
import { ReactComponent as X } from './x.svg';

class Snackbar extends Component {
  static defaultProps = {
    autoHideDuration: 10000,
    message: 'Default message',
  };

  constructor(props) {
    super(props);

    this.state = {
      isOpen: props.isOpen,
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleAnimationEnd = this.handleAnimationEnd.bind(this);
  }

  componentDidMount() {
    const { autoHideDuration, autoHide } = this.props;
    if (autoHide) {
      this.intervalID = setTimeout(() => {
        this.setState({ isOpen: false });
      }, autoHideDuration);
    }
  }

  handleClick() {
    this.setState({ isOpen: false });
  }

  handleAnimationEnd() {
    const { isOpen } = this.state;
    const { close } = this.props;

    if (!isOpen) {
      if (this.intervalID) clearTimeout(this.intervalID);
      close();
    }
  }

  render() {
    const { message } = this.props;
    const { isOpen } = this.state;

    return (
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
    );
  }
}

export default Snackbar;
