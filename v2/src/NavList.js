import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import './NavList.css';
import Hamburger from './Hamburger';

class NavList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isMenuActive: false,
    };

    this.toggleMenu = this.toggleMenu.bind(this);
    this.navList = React.createRef();
  }

  toggleMenu() {
    this.setState((st) => ({ isMenuActive: !st.isMenuActive }));
  }

  render() {
    const { isMenuActive } = this.state;
    return (
      <div>
        <ul
          className={`NavList ${isMenuActive ? 'NavList--show' : ''}`}
          id="NavList"
          ref={this.navList}
        >
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
        <Hamburger isActive={isMenuActive} handleClick={this.toggleMenu} />
      </div>
    );
  }
}

export default NavList;
