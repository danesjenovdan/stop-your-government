import React from 'react';
import { Link } from 'react-router-dom';

export const Header = () => (
  <header>
    <nav>
      <Link to="/">Home</Link>
      <Link to="/chat">Chat</Link>
    </nav>
  </header>
);
