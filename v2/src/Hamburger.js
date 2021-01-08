import React, { Component } from 'react';
import 'hamburgers/dist/hamburgers.css';
import './Hamburger.css';

class Hamburger extends Component {
  render() {
    const { isActive, handleClick } = this.props;
    return (
      <button
        className={`hamburger hamburger--squeeze ${isActive && 'is-active'}`}
        type="button"
        onClick={handleClick}
        aria-controls="NavList"
        aria-expanded={isActive ? 'true' : 'false'}
        aria-label="Toggle navigation"
      >
        <span className="hamburger-box">
          <span className="hamburger-inner" />
        </span>
      </button>
    );
  }
}

export default Hamburger;
