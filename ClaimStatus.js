import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import trackImg from '../../assets/claimstatus.jpg';
import axios from 'axios';
 
const ClaimStatus = () => {
  const [claimId, setClaimId] = useState('');
  const [claimData, setClaimData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [userClaims, setUserClaims] = useState([]);
  const [initialClaimsLoading, setInitialClaimsLoading] = useState(true);
  const [openCollapse, setOpenCollapse] = useState(false); 
 
  useEffect(() => {
    
    const fetchUserClaims = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
          setError('Please log in to view your claims.');
          setInitialClaimsLoading(false);
          return;
      }
  
      setInitialClaimsLoading(true);
      setError('');
  
      try {
          console.log("Fetching user claims...");
          const response = await axios.get('http://localhost:5000/api/claims/user', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
  
          console.log("Received claims:", response.data);
          const sortedClaims = response.data.claims.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
          setUserClaims(sortedClaims);
          setInitialClaimsLoading(false);
      } catch (err) {
          console.error('Error fetching user claims:', err.response ? err.response.data : err);
          setError('Failed to load your claims. Please try again later.');
          setInitialClaimsLoading(false);
      }
  };
  
 
    fetchUserClaims();
  }, []);
 
  const handleChange = (e) => {
    setClaimId(e.target.value);
    setClaimData(null);
    setError('');
  };
 
  const handleTrack = async () => {
    if (!claimId.trim()) {
      setError('Please enter a Claim ID.');
      setClaimData(null);
      return;
    }
 
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to track a claim.');
      setClaimData(null);
      return;
    }
 
    setLoading(true);
    setError('');
    setClaimData(null);
 
    try {
      const response = await axios.get(`http://localhost:5000/api/claims/${claimId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setClaimData(response.data.claim);
      setError('');
 
    } catch (err) {
      console.error('Error tracking claim:', err);
      if (err.response && err.response.status === 404) {
        setError('Claim not found or you do not have access to it.');
      } else if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('An error occurred while tracking the claim.');
      }
      setClaimData(null);
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="container py-5">
      <div className="row align-items-center">
        <div className="col-md-6 mb-4 mb-md-0 d-flex justify-content-center">
          <img
            src={trackImg}
            alt="Track Claim"
            className="img-fluid rounded-4 shadow-lg"
            style={{ maxHeight: '400px', objectFit: 'cover' }}
          />
        </div>
 
        <div className="col-md-6">
          <div className="card shadow-sm p-4">
            <h3 className="mb-4 text-center">Track Your Claim</h3>
            <form onSubmit={(e) => { e.preventDefault(); handleTrack(); }}>
              <div className="mb-3">
                <label htmlFor="claimIdInput" className="form-label">Claim ID:</label>
                <input
                  type="text"
                  className="form-control"
                  id="claimIdInput"
                  value={claimId}
                  onChange={handleChange}
                  placeholder="Enter Claim ID"
                  required
                />
              </div>
              <div className="d-grid">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  ) : (
                    'Track'
                  )}
                </button>
              </div>
            </form>
 
            {loading && <div className="alert alert-info mt-3">Loading claim details...</div>}
            {error && <div className="alert alert-danger mt-3">{error}</div>}
 
            {claimData && !loading && (
              <div className="mt-4">
                <p
                  className={`alert ${
                    claimData.status === 'Claim not found' ? 'alert-danger' : 'alert-success'
                  }`}
                >
                  <strong>Status:</strong> {claimData.status}
                </p>
                {claimData.incidentDetails && (
                  <div className="mt-3">
                    <p><strong>Details:</strong> {claimData.incidentDetails}</p>
                    {claimData.policyNumber && <p><strong>Policy Number:</strong> {claimData.policyNumber}</p>}
                    {claimData.incidentDate && <p><strong>Incident Date:</strong> {new Date(claimData.incidentDate).toLocaleDateString()}</p>}
                    {claimData.amount !== undefined && <p><strong>Amount:</strong> ${claimData.amount}</p>}
                    {claimData.supportingDocuments?.length > 0 && (
                      <p><strong>Supporting Documents:</strong> {claimData.supportingDocuments.join(', ')}</p>
                    )}
                    {claimData.submittedAt && <p><strong>Submitted On:</strong> {new Date(claimData.submittedAt).toLocaleString()}</p>}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
       
      <div className="row mt-5">
        <div className="col-12">
          <div className="card shadow-sm p-4">
            <h3 className="mb-3 text-center">
              Your Recent Claims
              <button
                onClick={() => setOpenCollapse(!openCollapse)}
                aria-controls="recent-claims-collapse"
                aria-expanded={openCollapse}
                className="btn btn-link ms-2"
              >
                {openCollapse ? 'Hide' : 'Show'} Claims
              </button>
            </h3>
 
            <div
              className={`collapse ${openCollapse ? 'show' : ''}`}
              id="recent-claims-collapse"
            >
              {initialClaimsLoading ? (
                <div className="text-center">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p>Loading your claims...</p>
                </div>
              ) : userClaims.length > 0 ? (
                <ul className="list-group list-group-flush">
                  {userClaims.map((claim) => (
                    <li key={claim.claimId} className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <strong>ID:</strong> {claim.claimId} <br/>
                        <strong>Policy:</strong> {claim.policyNumber} <br/>
                        <strong>Incident Date:</strong> {new Date(claim.incidentDate).toLocaleDateString()}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="alert alert-info text-center">
                  You have not submitted any claims yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default ClaimStatus;
 