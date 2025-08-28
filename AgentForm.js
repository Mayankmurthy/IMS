import React, { useState, useEffect } from 'react';
import axios from 'axios';
 
const AgentForm = ({ onSubmit, selectedAgent, action }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    username: '',
    password: '',
    status: ''
  });
 
  const [hovered, setHovered] = useState(false);
 
  useEffect(() => {
    if (selectedAgent) {
      setFormData(selectedAgent);
    } else {
      setFormData({ name: '', email: '', mobile: '', username: '', password: '', status: '' });
    }
  }, [selectedAgent]);
 
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //----------------------------------------------------------------------
      const name = formData.name || formData.username.replace('@agent', '');
      let message = `Agent: ${name} was ${selectedAgent && selectedAgent._id ? "updated" : "added"}`;
      //----------------------------------------------------------------------
      if (selectedAgent && selectedAgent._id) {
        await axios.put(`http://localhost:5000/api/agents/${selectedAgent._id}`, formData);
        alert(`Agent ${name} updated`);
      } else {
        await axios.post('http://localhost:5000/api/agents', formData);
        alert(`Agent ${name} added`);
      }
      //-------------------------------------------------------------------
      await axios.post("http://localhost:5000/api/activity", { text: message });
      //-------------------------------------------------------------------
      onSubmit();
    } catch (error) {
      console.error("Error saving agent:", error);
    }
  };
 
  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        
        <div className="col-md-6 mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Phone Number</label>
          <input type="text" className="form-control" name="mobile" value={formData.mobile} onChange={handleChange} required />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Username</label>
          <input type="text" className="form-control" name="username" value={formData.username} onChange={handleChange} required />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Status</label>
          <select className='form-control' name="status" value={formData.status} onChange={handleChange} required>
            <option value="">--Select--</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>
      <button type="submit" className="btn float-end" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        style={{ backgroundColor: hovered ? "var(--primary)" : "var(--accent)" }}>
        <i className={`bi ${action === 'edit' ? 'bi-pencil-fill' : 'bi-plus'}`}></i>
      </button>
    </form>
  );
};
 
export default AgentForm;