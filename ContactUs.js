import React, { useState } from 'react';
import axios from 'axios';

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
        rating: '5', 
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/api/feedback", formData); 

            if (response.status === 201) {
                alert("Thank you for your feedback!");
                setFormData({ name: "", email: "", message: "", rating: "5" }); 
            }
        } catch (error) {
            console.error("Error submitting feedback:", error);
            alert("Submission failed. Try again!");
        }
    };

    return (
        <div className='container-sm mt-5 w-50'>
            <div className="row border border-2 rounded-3 shadow-sm p-4 bg-light">
                <h2 className="text-center bg-light">Contact Us</h2>
                <p className="container text-center border w-50" style={{ backgroundColor: "beige" }}>
                    We would love to hear from you! Please reach out using the form below.
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Name*</label>
                        <input type="text" className="form-control" id="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email*</label>
                        <input type="email" className="form-control" id="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="message" className="form-label">Message*</label>
                        <textarea className="form-control" id="message" rows="4" value={formData.message} onChange={handleChange} required></textarea>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="rating" className="form-label">Rating (1-5)*</label>
                        <select className="form-control" id="rating" value={formData.rating} onChange={handleChange} required>
                            <option value="5">★★★★★ (5)</option>
                            <option value="4">★★★★☆ (4)</option>
                            <option value="3">★★★☆☆ (3)</option>
                            <option value="2">★★☆☆☆ (2)</option>
                            <option value="1">★☆☆☆☆ (1)</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
        </div>
    );
}

export default ContactUs;
