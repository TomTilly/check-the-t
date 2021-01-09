import React, { Component } from 'react';
import './Hero.css';

class Hero extends Component {
  static defaultProps = {
    background: 'white',
  };

  render() {
    const { children, background } = this.props;
    return (
      <div className="Hero" style={{ backgroundColor: background }}>
        <div className="container">{children}</div>
      </div>
    );
  }
}

export default Hero;
