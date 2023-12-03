import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png'; // Ensure this path is correct

const Header = ({ onSearch }) => {
  return (
    <div className="header">
      <Link to="/">
        <img src={logo} alt="Logo" className="logo" />
      </Link>
      <div className="search-container">
        <input 
          type="text" 
          placeholder="Search subjects..." 
          className="search-input"
          onChange={(e) => onSearch(e.target.value)}
        />
        <span className="search-icon">&#x1F50D;</span> {/* Unicode for magnifying glass */}
      </div>
    </div>
  );
};

export default Header;
