import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSibebar';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

function AdminHome() {
  return (
    <div className="d-flex flex-column flex-md-row min-vh-100">
      <AdminSidebar />
      <div className="flex-grow-1" style={{ backgroundColor: "var(--background)" }}>
        <Outlet />
      </div>
    </div>
  );
}

export default AdminHome;

