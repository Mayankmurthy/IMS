import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
 
function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); 
 

  const username = localStorage.getItem('username');
 

  const handleReset = (event) => {
    event.preventDefault();
    localStorage.setItem('Password:', newPassword); 
    setMessage(`Password reset successfully for ${username}`);
 
  
    setTimeout(() => {
      navigate('/signin'); 
    }, 2000); 
  };
 
  return (
    <div className='p-5 m-3'>
      <h2 className="card-title text-center text-dark">Reset Password</h2>
      <form onSubmit={handleReset}>
        <div className="form-group p-2 m-3 text-white">
          <label htmlFor="newPassword" className='text-dark p-2'>New Password:</label>
          <input
            className="form-control"
            type="password"
            id="newPassword"
            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <small>Password must be at least 8 characters long
          and include an uppercase letter, a lowercase letter, a number, and a special character.</small>
        </div>
        <button className="btn btn-success btn-block float-end" type="submit">Reset Password</button>
      </form>
      {message && <p className='text-white'><br /><br />{message}</p>}
    </div>
  );
}
 
export default ResetPassword;