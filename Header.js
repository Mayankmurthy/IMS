import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import Notifications from './Notifications';

const Header = () => {
  const { isLoggedIn, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isAdmin = user?.role === 'admin';
  const isAgent = user?.role === 'agent';
  const isUser = user?.role === 'user';

  const getHomePath = () => {
    if (isAdmin) {
      return "/admin";
    } else if (isAgent) {
      return "/agent";
    } else if (isUser) {
      return "/";
    }
    return "/";
  };

  const closeNavbar = () => {
    const navbarCollapse = document.getElementById('navbarNav');
    if (navbarCollapse?.classList.contains('show')) {
      new window.bootstrap.Collapse(navbarCollapse).hide();
    }
  };
  

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark shadow-sm sticky-top"
      style={{
        backgroundColor: 'var(--background)',
        transition: 'all 0.3s ease',
        padding: '0.75rem 1rem',
        fontFamily: 'Playfair Display, sans-serif',
      }}
    >
      <div className="container">
      <Link
  className="navbar-brand fw-bold d-flex align-items-center"
  to={getHomePath()}
  style={{
    color: "var(--text)", 
    fontSize: "1.2rem",
    fontFamily: "Poppins, sans-serif",
    letterSpacing: "0.01em", 
    textShadow: "0.5px 0.5px 1px rgba(0, 0, 0, 0.05)", 
    padding: "3px 0", 
    transition: "color 0.3s ease-in-out",
  }}
  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary)")}
  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text)")}
>
<i class="bi bi-graph-up-arrow p-2"> </i>
  GrowLife  

</Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={() => {
            const navbar = document.getElementById('navbarNav');
            if (navbar.classList.contains('show')) {
              new window.bootstrap.Collapse(navbar).hide();
            } else {
              new window.bootstrap.Collapse(navbar).show();
            }
          }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>


        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center gap-2">
            {isLoggedIn ? (
              <>
                 {isAgent && (
                  <li className="nav-item">
                  <button
                    className="btn text-black"
                    onClick={() => { closeNavbar(); handleLogout(); }}
                    title="Sign Out"
                    style={{ fontSize: '1.5rem' }}
                  >
                    <i className="bi bi-box-arrow-right"></i>
                  </button>
                </li>
                )}
                {isAdmin && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin/" style={{ color: "var(--text)" }} onClick={closeNavbar}>
                        Home
                      </Link>
                    </li>
                    <li className="nav-item">
                      <button
                        className="btn text-black"
                        onClick={() => { closeNavbar(); handleLogout(); }}
                        title="Sign Out"
                        style={{ fontSize: '1.5rem' }}
                      >
                        <i className="bi bi-box-arrow-right"></i>
                      </button>
                    </li>
                  </>
                )}
                {isUser && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/" style={{ color: "var(--text)" }} onClick={closeNavbar}>
                        Home
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/policyform" style={{ color: "var(--text)" }} onClick={closeNavbar}>
                        Plans
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/reviewclaim" style={{ color: "var(--text)" }} onClick={closeNavbar}>
                        File Claims
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/claimstatus" style={{ color: "var(--text)" }} onClick={closeNavbar}>
                        Track Claims
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link position-relative" to="/mycart" style={{ color: "var(--text)" }} onClick={closeNavbar}>
                        My Cart
                      </Link>
                    </li>
                    <li className="nav-item">
                      <button
                        className="btn text-black"
                        onClick={() => { closeNavbar(); handleLogout(); }}
                        title="Sign Out"
                        style={{ fontSize: '1.5rem' }}
                      >
                        <i className="bi bi-box-arrow-right"></i>
                      </button>
                    </li>
                    <li className="nav-item">
                      <Notifications />
                    </li>
                  </>
                )}
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/signin" className="nav-link fw-semibold" style={{ color: "var(--text)" }} onClick={closeNavbar}>
                    Sign In
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold" style={{ color: "var(--text)" }} to="/aboutus" onClick={closeNavbar}>
                    About Us
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold" style={{ color: "var(--text)" }} to="/contactus" onClick={closeNavbar}>
                    Contact Us
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;