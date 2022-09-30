import React from 'react';
import { Intro } from '../components/Intro.jsx';

export const Home = ({ lang }) => (
  <div className="container">
    <Intro lang={lang} />
  </div>
);
