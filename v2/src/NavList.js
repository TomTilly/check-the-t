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

  expandMenu() {
    const { navList } = this;
    // get the height of the element's inner content, regardless of its actual size
    const menuHeight = navList.scrollHeight;

    // have the element transition to the height of its inner content
    navList.style.height = `${menuHeight}px`;

    // when the next css transition finishes (which should be the one we just triggered)
    navList.addEventListener(
      'transitionend',
      function () {
        // remove "height" from the element's inline styles, so it can return to its initial value
        navList.style.height = null;
      },
      { once: true }
    );
  }

  collapseMenu() {
    const { navList } = this;

    // get the height of the element's inner content, regardless of its actual size
    const menuHeight = navList.scrollHeight;

    // temporarily disable all css transitions
    const elementTransition = navList.style.transition;
    navList.style.transition = '';

    // on the next frame (as soon as the previous style change has taken effect),
    // explicitly set the element's height to its current pixel height, so we
    // aren't transitioning out of 'auto'
    requestAnimationFrame(function () {
      navList.style.height = `${menuHeight}px`;
      navList.style.transition = elementTransition;

      // on the next frame (as soon as the previous style change has taken effect),
      // have the element transition to height: 0
      requestAnimationFrame(function () {
        navList.style.height = `${0}px`;
      });
    });
  }

  toggleMenu() {
    const { isMenuActive } = this.state;
    if (isMenuActive) {
      this.collapseMenu();
    } else {
      this.expandMenu();
    }
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
