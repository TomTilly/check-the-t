import React, { Component } from 'react';

class MainWrapper extends Component {
  render() {
    const { children, fullWidth, background } = this.props;
    console.log(fullWidth);
    return (
      <main className="MainWrapper" style={{ flexGrow: 1, background }}>
        {fullWidth ? children : <div className="container">{children}</div>}
      </main>
    );
  }
}

export default MainWrapper;
