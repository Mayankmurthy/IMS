import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../Styles/style.css';
import { useAuth } from '../AuthContext';
import axios from 'axios';
 
const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  const [hovered, setHovered] = useState(false);
 
 
const handleSubmit = async (event) => {
    event.preventDefault();
 
    try {
        const response = await axios.post('http://localhost:5000/api/login', {
            username,
            password
        });
 
        if (response.status === 200) {
            const { user, token } = response.data;
 
            localStorage.setItem('authUser', JSON.stringify(user));
            localStorage.setItem('token', token);
 
            login(username,password);
            alert("Login Successful");
 
            if (user.role === "admin") {
                navigate('/admin');
            } else if (user.role === "agent") {
                navigate('/agent');
            } else {
                navigate('/');
            }
        }
    } catch (error) {
        alert("Invalid username or password");
    }
};
 
 
  return (
    <div className="container d-flex justify-content-center align-items-center mt-4 rounded-4 w-50" style={{ paddingBottom: "30px" }}>
      <div className="container container-lg row justify-content-center bg-light rounded-5" style={{ width: '99%' }}>
        <div className="col-md-6 p-4 rounded-4" style={{ width: '99%' }}>
          <div className="card p-2 rounded-4">
            <div className="card-body rounded-4">
              <h3 className="card-title text-center">Sign In</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    className="form-control"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group form-check">
                  <input type="checkbox" style={{ marginLeft: '4px' }} className="form-check-input" id="rememberMe" />
                  <label className="form-check-label" style={{ marginLeft: '5px' }} htmlFor="rememberMe">Remember me</label>
                </div>
                <div className='d-flex justify-content-center align-items-center'>
                  <button type="submit" className="btn btn-block text-black"
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    style={{ backgroundColor: hovered ? "var(--primary)" : "var(--accent)", border: "none" }}>
                    LOGIN
                  </button>
                </div>
              </form>
              {error && <div className="alert alert-primary mt-3 text-center">{error}</div>}
              <div className="text-center mt-3">
                <Link to="/forgot-password" className="text-primary">Forgot Password</Link>
              </div>
              <div className="text-center mt-3">
                Don't have an account? <Link to="/signup" className="text-primary">Register here.</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default SignIn;