// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/profile/1">Profile</Link>  
        <button className="btn btn-primary">Like</button>
{/* Example profile link */}
      </nav>
    </header>
  );
};

export default Header;
