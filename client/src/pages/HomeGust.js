
import React from 'react';
import { Link } from 'react-router-dom';
import './gust.css';

const Home = () => {
  return (
    <div className="home">


      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h2>Discover a New Way to Connect</h2>
          <p>
            MySocial brings together the best features to help you grow your network,
            share your achievements, and stay updated with the latest trends.
          </p>
          <header className="home-header">
            <div className="header-content">
              <div className="home-buttons">
                <Link to="/login" className="btn btn-primary">Login</Link>
                <Link to="/register" className="btn btn-secondary">Register</Link>
              </div>
            </div>
          </header> </div>
      </section>

      <footer className="home-footer">
        <p>&copy; 2025 MySocial. All Rights Reserved.</p>
        <div className="footer-links">
          <Link to="/terms">Terms of Service</Link>
          <Link to="/privacy">Privacy Policy</Link>
        </div>
      </footer>
    </div>
  );
};

export default Home;

