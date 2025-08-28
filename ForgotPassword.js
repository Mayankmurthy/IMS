import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
 
function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
 

  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000);
  };
 

  const handleSendOtp = (event) => {
    event.preventDefault();
    const newOtp = generateOtp();
    setGeneratedOtp(newOtp);
    localStorage.setItem('otp', newOtp); 
    setMessage(`OTP sent to ${email}: ${newOtp}`);
  };
 
  
  const handleVerifyOtp = (event) => {
    event.preventDefault();
    const storedOtp = localStorage.getItem('otp');
    if (storedOtp === otp) {
      setMessage('OTP verified successfully!');
      navigate('/reset'); 
    } else {
      setMessage('Invalid OTP. Please try again.');
    }
  };
 
  return (
    <div className='p-5 m-3'>
      <h2 className="card-title text-center text-dark">Forgot Password</h2>
      <form onSubmit={handleSendOtp}>
        <div className="form-group p-2 m-3">
          <label htmlFor="email" className='text-dark p-2 '>Email:</label>
          <input
            className="form-control "
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button className="btn btn-success btn-block float-end" type="submit">Send OTP</button>
      </form>
 
      {generatedOtp && (
        <form onSubmit={handleVerifyOtp} className='mt-3'>
          <div className="form-group p-2 m-3">
            <label htmlFor="otp" className='text-white p-2'>Enter OTP:</label>
            <input
              className="form-control"
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
          <button className="btn btn-primary btn-block float-end" type="submit">Verify OTP</button>
        </form>
      )}
 
      {message && <p className='text-white'><br /><br />{message}</p>}
    </div>
  );
}
 
export default ForgotPassword;