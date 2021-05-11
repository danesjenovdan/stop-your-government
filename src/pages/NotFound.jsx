import React from 'react';
import { Link } from 'react-router-dom';

export const NotFound = () => (
  <div className="container">
    <h1>404: Not Found</h1>
    <p>
      <Link to="/">Go Home</Link>
    </p>
  </div>
);
