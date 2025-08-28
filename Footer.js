import React from 'react';
 
const Footer = () => {
  return (
    <div style={{backgroundColor:"var(--background)",padding:"40px"}}>
    <footer className="text-white pt-5 pb-4" style={{ backgroundColor: '#e6e9ef',borderRadius: '40px'}}>
      <div className="container text-md-left">
        <div className="row text-md-left">
 
          <div className="col-md-4 col-lg-4 col-xl-4 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 font-weight-bold" style={{color:"var(--text)"}}>GrowLife</h5>
            <p style={{color:"var(--text)"}}>
              Manage your customers, policies, and claims efficiently with our intuitive insurance management system.
            </p>
          </div>
 
          <div className="col-md-3 col-lg-3 col-xl-3 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 font-weight-bold" style={{color:"var(--text)"}}>Quick Links</h5>
            <p><a href="/" className="text-decoration-none" style={{color:"var(--text)"}}>Home</a></p>
            <p><a href="/" className="text-decoration-none" style={{color:"var(--text)"}}>Customers</a></p>
            <p><a href="/" className="text-decoration-none" style={{color:"var(--text)"}}>Policies</a></p>
            <p><a href="/" className="text-decoration-none" style={{color:"var(--text)"}}>Claims</a></p>
          </div>
 
          <div className="col-md-4 col-lg-4 col-xl-4 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 font-weight-bold" style={{color:"var(--text)"}}>Contact</h5>
            <p  style={{color:"var(--text)"}}><i className="bi bi-house-door-fill me-2" style={{color:"var(--primary"}}></i> Chennai, Tamil Nadu, India</p>
            <p  style={{color:"var(--text)"}}><i className="bi bi-envelope-fill me-2" style={{color:"var(--primary"}}></i> support@growlife.com</p>
            <p  style={{color:"var(--text)"}}><i className="bi bi-telephone-fill me-2" style={{color:"var(--primary"}}></i> +91 98765 43210</p>
          </div>
        </div>
 
        <hr className="mb-4" style={{color:"var(--text)"}}/>
 
        <div className="row align-items-center">
          <div className="col-md-7 col-lg-8">
            <p className="text-center text-md-start"  style={{color:"var(--text)"}}>
              © {new Date().getFullYear()} GrowLife. All Rights Reserved.
            </p>
          </div>
          <div className="col-md-5 col-lg-4">
            <div className="text-center text-md-end">
              <a href="#" className="me-4" style={{color:"var(--primary"}}><i className="bi bi-facebook"></i></a>
              <a href="#" className="me-4" style={{color:"var(--primary"}}><i className="bi bi-twitter"></i></a>
              <a href="#" className="me-4" style={{color:"var(--primary"}}><i className="bi bi-linkedin"></i></a>
              <a href="#" style={{color:"var(--primary"}}><i className="bi bi-github"></i></a>
            </div>
          </div>
        </div>
      </div>
    </footer>
    </div>
  );
};
 
export default Footer;
