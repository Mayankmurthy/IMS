import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CustomerForm = ({ onSubmit, selectedCustomer, action, currentUserInfo }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        dateofbirth: '',
        mobile: '',
        password: '',
        registeredBy: '' 
    });

    const [hovered, setHovered] = useState(false);

    useEffect(() => {
        if (selectedCustomer) {
            setFormData({
                username: selectedCustomer.username || '',
                email: selectedCustomer.email || '',
                dateofbirth: selectedCustomer.dateofbirth ? new Date(selectedCustomer.dateofbirth).toISOString().split('T')[0] : '',
                mobile: selectedCustomer.mobile || '',
                password: selectedCustomer.password || '',
                registeredBy: selectedCustomer.registeredBy || '' 
            });
        } else {
            let registeredByValue = 'Self'; 

            if (currentUserInfo && currentUserInfo.role) {
                if (currentUserInfo.role === 'admin') {
                    registeredByValue = 'Admin';
                } else if (currentUserInfo.role === 'agent' && currentUserInfo.username) {
                    const agentName = currentUserInfo.username.split('@')[0];
                    registeredByValue = `${agentName} (Agent)`;
                }
            }

            setFormData({
                username: '',
                email: '',
                dateofbirth: '',
                mobile: '',
                password: '',
                registeredBy: registeredByValue 
            });
        }
    }, [selectedCustomer, currentUserInfo]); 


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formattedData = {
            ...formData,
            dateofbirth: new Date(formData.dateofbirth)
        };

        console.log("Sending Data:", formattedData);

        try {
            let message = `Customer: ${formData.username} was ${selectedCustomer && selectedCustomer._id ? "updated" : "added"}`;
            if (selectedCustomer && selectedCustomer._id) {
                const { registeredBy, ...dataToUpdate } = formattedData; 
                await axios.put(`http://localhost:5000/api/customers/${selectedCustomer._id}`, dataToUpdate);
                alert(`Customer ${formData.username} updated`);
            } else {
                await axios.post('http://localhost:5000/api/customers', formattedData);
                alert(`Customer ${formData.username} added`);
            }
            await axios.post("http://localhost:5000/api/activity", { text: message });

            onSubmit();

        } catch (error) {
            console.error("Error saving customer:", error);
            if (error.response && error.response.data && error.response.data.error) {
                alert(`Error: ${error.response.data.error}`);
            } else {
                alert("An unexpected error occurred while saving the customer.");
            }
        }
    };


    return (
        <form onSubmit={handleSubmit}>
            <div className="row">
                <div className="col-md-6 mb-3">
                    <label className="form-label">Username</label>
                    <input type="text" className="form-control" name="username" value={formData.username} onChange={handleChange} required />
                </div>
                <div className="col-md-6 mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="col-md-6 mb-3">
                    <label className="form-label">Date of Birth</label>
                    <input type="date" className="form-control" name="dateofbirth" value={formData.dateofbirth} onChange={handleChange} required />
                </div>
                <div className="col-md-6 mb-3">
                    <label className="form-label">Phone Number</label>
                    <input type="text" className="form-control" name="mobile" value={formData.mobile} onChange={handleChange} required />
                </div>
                <div className="col-md-6 mb-3">
                    <label className="form-label">Password</label>
                    <input type="text" className="form-control" name="password" value={formData.password} onChange={handleChange} required />
                </div>
            </div>
            <button type="submit" className="btn float-end" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
                style={{ backgroundColor: hovered ? "var(--primary)" : "var(--accent)" }}>
                <i className={`bi ${action === 'edit' ? 'bi-pencil-fill' : 'bi-plus'}`}></i>
            </button>
        </form>
    );
};

export default CustomerForm;