import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import insuranceImg from '../../assets/9175929_1099.jpg';

function Hero() {
  const { isLoggedIn } = useAuth();
  const username = JSON.parse(localStorage.getItem('authUser'))?.username || 'Guest';

  const heroStyle = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${insuranceImg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: 'white',
    padding: '6rem 0',
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'center',
  };

  const cardStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '15px',
    padding: '2rem',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
  };

  const headingStyle = {
    fontWeight: '700',
    fontSize: '3.5rem',
    textShadow: '2px 2px 6px rgba(0,0,0,0.8)',
  };

  const paragraphStyle = {
    fontSize: '1.25rem',
    textShadow: '1px 1px 4px rgba(0,0,0,0.7)',
  };

  return (
    <header style={heroStyle} className="text-center">
      <div className="container">
        <div className="mx-auto text-white" style={cardStyle}>
          <h1 style={headingStyle}>Protect What Matters Most</h1>
          <p className="lead mt-3" style={paragraphStyle}>
            Explore our insurance plans tailored for your needs.
          </p>
          {!isLoggedIn ? (
            <Link to="/signin" className="btn btn-outline-light btn-lg mt-4 px-5">
              Sign In
            </Link>
          ) : (
            <p className="lead mt-4" style={paragraphStyle}>Welcome back, {username}!</p>
          )}
        </div>
      </div>
    </header>
  );
}

export default Hero;
