import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';


const SignUp = () => {
    const [username, setUsername] = useState('');
    const [dateofbirth, setDateofbirth] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [file, setFile] = useState(null);
    const [otp, setOtp] = useState('');
    const [generatedOtp, setGeneratedOtp] = useState(null);
    const [isVerified, setIsVerified] = useState(false);
    const navigate = useNavigate();
    const [hovered, setHovered] = useState(false);
    const [hovered1, setHovered1] = useState(false);
    const [hovered2, setHovered2] = useState(false);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        const allowedTypes = ['image/png', 'image/jpeg', 'application/pdf'];

        if (!allowedTypes.includes(selectedFile.type)) {
            alert('Invalid file type! Please upload PNG, JPEG, or PDF.');
            return;
        }
        setFile(selectedFile);
    };

    const handleGenerateOtp = async () => {
        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            alert('Invalid email format! Please enter a valid email address.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                setGeneratedOtp(true); 
            } else {
                alert(data.message || 'Failed to send OTP');
            }
        } catch (error) {
            alert('Error sending OTP: ' + error.message);
        }
    };

    const handleVerifyOtp = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp })
            });

            const data = await response.json();
            if (response.ok) {
                setIsVerified(true);
                setGeneratedOtp(false); 
                alert('OTP verified successfully!');
            } else {
                alert('Invalid OTP. Please try again.');
            }
        } catch (error) {
            alert('Error verifying OTP: ' + error.message);
        }
    };


    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!username.match(/^[A-Za-z\d]+$/)) {
            alert('Invalid username! Only letters and numbers are allowed.');
            return;
        }
        if (!dateofbirth) {
            alert('Please enter your date of birth.');
            return;
        }

        const birthDate = new Date(dateofbirth);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        const dayDifference = today.getDate() - birthDate.getDate();

        if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
            if (age <= 18) { 
                alert('You must be at least 18 years old to sign up.');
                return;
            }
        } else if (age < 18) { 
            alert('You must be at least 18 years old to sign up.');
            return;
        }
       
        if (!mobile.match(/^\d{10}$/)) {
            alert('Invalid mobile number! Please enter a 10-digit number.');
            return;
        }
        if (!email.match(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)) {
            alert('Invalid email! Please enter a valid Gmail address.');
            return;
        }
        if (!isVerified) {
            alert('Please verify your email before signing up.');
            return;
        }
        if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)) {
            alert('Invalid password! It must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.');
            return;
        }
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        if (!file) {
            alert('Please upload a government proof.');
            return;
        }

        const formData = new FormData();
        formData.append("username", username);
        formData.append("dateofbirth", dateofbirth);
        formData.append("mobile", mobile);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("file", file); 
        console.log("Form data prepared:", formData);
        for (let pair of formData.entries()) {
            console.log(pair[0] + ':', pair[1]); 
        }


        try {
            const response = await axios.post('http://localhost:5000/api/signup', formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            console.log("Signup response:", response.data);
            if (response.status === 201) {
                alert("Registration Successful");
                navigate('/signin');
            }
        } catch (error) {
            console.error("Signup error:", error.response?.data || error.message);

            if (error.response?.status === 409) {
                alert(error.response.data.error);
            } else {
                alert("Signup failed! Please try again.");
            }
        }

    };


    return (
        <div className="container d-flex justify-content-center align-items-center mt-4 rounded-4 w-50" style={{ width: '99%' }}>
            <div className="row d-flex justify-content-center align-items-center bg-light rounded-5" style={{ width: '99%' }}>
                <div className="col-md-6 p-4 rounded-4" style={{ width: '99%' }}>
                    <div className="card rounded-4">
                        <div className="card-body rounded-4">
                            <h3 className="text-center">Sign Up</h3>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="username">Username</label>
                                    <input
                                        type="text"
                                        id="username"
                                        className="form-control"
                                        pattern="^[A-Za-z\d]+$"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="dateofbirth">Date Of Birth</label>
                                    <input
                                        type="date"
                                        id="dateofbirth"
                                        className="form-control"
                                        value={dateofbirth}
                                        onChange={(e) => setDateofbirth(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="mobile">Mobile Number</label>
                                    <input
                                        type="tel"
                                        id="mobile"
                                        className="form-control"
                                        pattern="^\d{10}$"
                                        value={mobile}
                                        onChange={(e) => setMobile(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <div className="input-group">
                                        <input
                                            type="email"
                                            id="email"
                                            className="form-control"
                                            pattern="^[a-zA-Z0-9._%+-]+@gmail\.com$"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                        {isVerified && (
                                            <span className="input-group-text bg-transparent border-0 position-absolute end-0 pe-3">
                                                <i className="bi bi-check-circle text-success"></i> 
                                            </span>
                                        )}
                                    </div>
                                    {!isVerified && (
                                        <button type="button" className="btn btn-secondary mt-2 text-black" onClick={handleGenerateOtp} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ backgroundColor: hovered ? "var(--primary)" : "var(--accent)", border: "none" }}>
                                            Send OTP
                                        </button>
                                    )}
                                </div>

                                {generatedOtp && !isVerified && (
                                    <div className="form-group">
                                        <label htmlFor="otp">Enter OTP</label>
                                        <input
                                            type="text"
                                            id="otp"
                                            className="form-control"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            required
                                        />
                                        <button type="button" className="btn btn-success mt-2 text-black" onClick={handleVerifyOtp} onMouseEnter={() => setHovered1(true)} onMouseLeave={() => setHovered1(false)} style={{ backgroundColor: hovered1 ? "var(--primary)" : "var(--accent)", border: "none" }}>
                                            Verify OTP
                                        </button>
                                    </div>
                                )}

                                <div className="form-group">
                                    <label htmlFor="password">Password</label>
                                    <input
                                        type="password"
                                        id="password"
                                        className="form-control"
                                        pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <small>Password must be at least 8 characters long
                                        and include an uppercase letter, a lowercase letter, a number, and a special character.</small>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="confirmPassword">Confirm Password</label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        className="form-control"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="proof">Government Proof</label>
                                    <input
                                        className="form-control"
                                        type="file"
                                        accept=".jpg, .jpeg, .png, .pdf"
                                        id="proof"
                                        onChange={handleFileChange}
                                        required
                                    />
                                </div>
                                <div className='d-flex justify-content-center align-items-center'>
                                    <button type="submit" className="btn btn-block text-black" onMouseEnter={() => setHovered2(true)} onMouseLeave={() => setHovered2(false)} style={{ backgroundColor: hovered2 ? "var(--primary)" : "var(--accent)", border: "none" }}>Sign Up</button>
                                </div>
                                <Link to="/signin" className="text-primary d-flex justify-content-center align-items-center mt-3">Go Back</Link>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;