import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AgentSidebar from './AgentSidebar';

function AgentHome() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="d-flex flex-column flex-md-row min-vh-100 overflow-hidden">
      <AgentSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      <div className="flex-grow-1 d-flex flex-column" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="p-3 d-md-none border-bottom bg-white shadow-sm">
          <button className="btn btn-outline-secondary" onClick={toggleSidebar}>
            ☰ Menu
          </button>
        </div>

        <div className="flex-grow-1 p-3">
          <div className="bg-white p-4 rounded shadow-sm h-100">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AgentHome;
