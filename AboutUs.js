import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import aboutImg from '../../assets/aboutUs.jpg';

const AboutUs = () => {
  return (
    <div className="container py-5">
      <div className="row align-items-center">
        <div className="col-md-6 mb-4 mb-md-0">
          <img
            src={aboutImg}
            alt="Insurance Management"
            className="img-fluid rounded shadow-sm"
          />
        </div>
        <div className="col-md-6">
          <h2 className="mb-3">About Us</h2>
          <p className="lead">
            Welcome to <strong>GrowLife</strong> — your trusted partner in modern insurance management. Our platform is designed to simplify, streamline, and secure the way you handle insurance policies, claims, and customer data.
          </p>
          <p>
            With a focus on innovation and user experience, we empower insurance providers and policyholders with tools that enhance transparency, reduce paperwork, and improve decision-making.
          </p>
          <p>
            Whether you're managing individual policies or enterprise-level portfolios, GrowLife adapts to your needs with scalable, cloud-based solutions.
          </p>
          <p className="text-muted">
            Secure. Scalable. Smart. That's the GrowLife promise.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
