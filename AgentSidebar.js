import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Offcanvas } from 'react-bootstrap';

function AgentSidebar({ isOpen, onClose }) {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768); 

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navItems = [
    { path: '/agent/profile', label: 'Profile', icon: 'bi-person' },
    { path: '/agent/customermanage', label: 'Manage Customers', icon: 'bi-people' },
    { path: '/agent/assignedpolicy', label: 'Assigned Policies', icon: 'bi-card-checklist' },
  ];

  const SidebarContent = (
    <nav className="nav flex-column">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`nav-link d-flex align-items-center text-white mb-2 px-2 py-2 rounded ${
            location.pathname === item.path ? 'bg-secondary' : 'hover-bg'
          }`}
          onClick={onClose}
        >
          <i className={`bi ${item.icon} me-2`} style={{ fontSize: '1.2rem' }}></i>
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );

  return (
    <>
      {isMobile ? (
        <Offcanvas show={isOpen} onHide={onClose} className="bg-dark text-white">
          <Offcanvas.Header closeButton closeVariant="white">
            <Offcanvas.Title>Agent Menu</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>{SidebarContent}</Offcanvas.Body>
        </Offcanvas>
      ) : (
        <div
          className="bg-dark text-white p-3 shadow-sm d-none d-md-block"
          style={{ minHeight: '100vh', width: '220px' }}
        >
          {SidebarContent}
        </div>
      )}

      <style>
        {`
          .hover-bg:hover {
            background-color: rgba(255, 255, 255, 0.1);
          }
        `}
      </style>
    </>
  );
}

export default AgentSidebar;
