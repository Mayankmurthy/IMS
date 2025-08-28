 
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
 
const AuthContext = createContext();
 
const determineUserRole = (username) => {
  if (username === 'admin') {
    return 'admin';
  } else if (username && username.includes('@agent')) {
    return 'agent';
  } else {
    return 'user';
  }
};
 
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null); 
  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('authUser'));
      const token = localStorage.getItem('token');
 
      if (storedUser && token) {
        if (!storedUser.role && storedUser.username) {
          storedUser.role = determineUserRole(storedUser.username);
        }
        setUser(storedUser);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error("Failed to load user from localStorage:", error);
      localStorage.removeItem('authUser');
      localStorage.removeItem('token');
    }
  }, []); 
 
  const login = async (username, password) => {
    try {
      console.log("User data before sending:", username, password);
 
      if (!password || password.trim() === "") {
        console.error("Password is missing!");
        alert("Password cannot be empty");
        return;
      }
 
      const response = await axios.post('http://localhost:5000/api/login', {
        username,
        password
      });
 
      console.log("Login API Response:", response.data);
 
      if (response.status === 200) {
        const { user: apiUser, token } = response.data; 
        const determinedRole = determineUserRole(apiUser.username);
        const fullUserData = { ...apiUser, role: determinedRole };
 
        localStorage.setItem('authUser', JSON.stringify(fullUserData)); 
        localStorage.setItem('token', token);
 
        setUser(fullUserData); 
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error("AuthContext login error:", error.response ? error.response.data : error.message);
      alert("Invalid username or password");
    }
  };
 
  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('authUser');
    localStorage.removeItem('token');
  };
 
  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};
 
export const useAuth = () => useContext(AuthContext);
 