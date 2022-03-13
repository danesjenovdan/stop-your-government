import React from 'react';
import { Link } from 'react-router-dom';

export const Stories = () => (
  <div className="container">
    <h1>Stories</h1>
    <p>Select story:</p>
    <ul>
      <li>
        <Link to="/story?id=60866bc48da3c7319440cd2c">Demo story</Link>
      </li>
      <li>
        <Link to="/story?id=61c31d6dfb3f79442dd89099">Variables test</Link>
      </li>
      <li>
        <Link to="/story?id=doesntexist">Non-existent story</Link>
      </li>
    </ul>
  </div>
);
