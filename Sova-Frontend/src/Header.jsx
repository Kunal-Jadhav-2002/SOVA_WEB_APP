import { useState, useEffect } from 'react';
import './App.css'
import './Responisve.css'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(prevState => !prevState);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Close the menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const menu = document.getElementById('menu');
      const hamburger = document.querySelector('.hamburger-menu');

      if (menu && !menu.contains(event.target) && !hamburger.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    
    // Cleanup event listener
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <header className="header">
      <div className="logo">
        <img className="l1" src="public/images/Sova-logo.jpg" loading="lazy" alt="Sova Logo" />
        <div className="heading">
          <h1 className="h1">SOVA</h1>
          <h1 className="h2">Gloves</h1>
        </div>
      </div>
      <div className="navbar">
        <ul className="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#mission">Mission</a></li>
          <li><a href="#product">Product</a></li>
          <li><a href="#gift">Rewards</a></li>
          <li><a href="#reviews">Reviews</a></li>
          <li><a href="#about">About</a></li>
        </ul>
      </div>
      
      {/* Hamburger Menu */}
      <div className="hamburger-menu" onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Menu */}
      <nav className={`menu ${isMenuOpen ? 'open' : ''}`} id="menu">
        <ul>
          <li><a href="#home" onClick={closeMenu}>Home</a></li>
          <li><a href="#mission" onClick={closeMenu}>Mission</a></li>
          <li><a href="#product" onClick={closeMenu}>Product</a></li>
          <li><a href="#gift" onClick={closeMenu}>Gift</a></li>
          <li><a href="#reviews" onClick={closeMenu}>Reviews</a></li>
          <li><a href="#about" onClick={closeMenu}>About us</a></li>
        </ul>
      </nav>

      {/* Donate Now Button */}
      <div className="gift-container">
        <a href="#gift" className="gift-btn">Contribute Now</a>
      </div>
    </header>
  );
};

export default Header;