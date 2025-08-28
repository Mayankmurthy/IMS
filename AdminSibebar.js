import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';

const AdminSidebar = () => {
  const navigate = useNavigate();
 
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  useEffect(() => {
    document.body.style.overflow = showOffcanvas ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto'; 
    };
  }, [showOffcanvas]);

  const handleNav = (path) => {
    navigate(path);
    setShowOffcanvas(false);
  };

  return (
    <>
      <div className="d-md-none p-2 shadow-sm border-bottom">
        <button
          className="btn btn-dark"
          type="button"
          onClick={() => setShowOffcanvas(true)}
        >
          <i className="bi bi-list me-2"></i> Admin Menu
        </button>
      </div>

      <div
        className={`offcanvas offcanvas-start d-md-none ${showOffcanvas ? 'show' : ''}`} 
        id="adminSidebar"
        tabIndex="-1"
        aria-labelledby="adminSidebarLabel" 
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="adminSidebarLabel">Admin Menu</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowOffcanvas(false)} 
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <SidebarLinks handleNav={handleNav} />
        </div>
      </div>
      <div className="d-none d-md-block vh-100 border-end p-3" style={{ width: '250px' }}>
        <SidebarLinks handleNav={handleNav} />
      </div>
      {showOffcanvas && (
        <div
          className="offcanvas-backdrop fade show"
          onClick={() => setShowOffcanvas(false)}
        ></div>
      )}
    </>
  );
};

const SidebarLinks = ({ handleNav }) => {
  const links = [
    { path: "/admin/customer", label: "Manage Customers", icon: "bi-people" },
    { path: "/admin/agentform", label: "Manage Agents", icon: "bi-person-badge" },
    { path: "/admin/assignpolicy", label: "Assign Policy", icon: "bi-shield-check" },
    { path: "/admin/policy", label: "Manage Policies", icon: "bi-file-earmark-text" },
    { path: "/admin/review", label: "Review Claim", icon: "bi-card-checklist" },
  ];

  return (
    <ul className="nav flex-column">
      {links.map(({ path, label, icon }) => (
        <li key={path} className="nav-item">
          <button
            className="nav-link text-start text-dark btn btn-link w-100"
            onClick={() => handleNav(path)}
          >
            <i className={`bi ${icon} me-2`}></i> {label}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default AdminSidebar;