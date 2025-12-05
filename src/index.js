import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Watercolors from './pages/watercolors/watercolors';
import AboutMe from './pages/about-me/about-me';
import Header from './header';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Header />
    { window.location.href.toLowerCase().indexOf('about-me') > -1 ? <AboutMe /> : <Watercolors />}
  </React.StrictMode>
);
