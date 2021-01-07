import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import './NavList.css';

class NavList extends Component {
  render() {
    return (
      <ul className="NavList">
        <li className="NavList__list-item">
          <NavLink
            to="/"
            exact
            activeClassName="NavList__link--active"
            className="NavList__link"
          >
            Home
          </NavLink>
        </li>
        <li className="NavList__list-item">
          <NavLink
            to="/about"
            exact
            activeClassName="NavList__link--active"
            className="NavList__link"
          >
            About
          </NavLink>
        </li>
      </ul>
    );
  }
}

export default NavList;
