import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import NavList from './NavList';

class Navbar extends Component {
  render() {
    return (
      <nav className="Navbar">
        <Link className="Navbar-brand" to="/">
          Check the T
        </Link>
        <NavList />
      </nav>
    );
  }
}

export default Navbar;
