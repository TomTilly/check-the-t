import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import NavList from './NavList';
import './Navbar.css';

class Navbar extends Component {
  render() {
    return (
      <nav className="Navbar">
        <div className="Navbar-container container">
          <Link className="Navbar__brand" to="/">
            Check the T
          </Link>
          <NavList />
        </div>
      </nav>
    );
  }
}

export default Navbar;
