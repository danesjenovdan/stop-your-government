import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Header.module.scss';

export const Header = () => (
  <header className={styles.header}>
    <nav className={styles.nav}>
      <NavLink to="/" activeClassName={styles.active} exact>
        Home
      </NavLink>
      <NavLink to="/stories" activeClassName={styles.active}>
        Stories
      </NavLink>
    </nav>
  </header>
);
