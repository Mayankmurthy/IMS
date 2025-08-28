import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import Header from './Components/UserPanel/Header';
import Footer from './Components/UserPanel/Footer';
import AppRoutes from './AppRoutes';

import { AuthProvider, useAuth } from './Components/AuthContext';


function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ display: 'flex', backgroundColor: 'var(--background)' }}>
          <div style={{ flex: 1 }}>
            <Header />
            <AppRoutes />
            <Footer />
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

