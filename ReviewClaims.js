import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const ReviewClaims = () => {
    const [claims, setClaims] = useState([]);
    const [selectedClaim, setSelectedClaim] = useState(null);
    const [reviewStatus, setReviewStatus] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [userRole, setUserRole] = useState(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const fetchAllClaims = async () => {
            setLoading(true);
            setError('');

            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('Authentication required. Please log in as an agent/admin to view claims.');
                    setLoading(false);
                    return;
                }

                const decodedToken = jwtDecode(token);
                setUserRole(decodedToken.role);

                const response = await axios.get('http://localhost:5000/api/claims/all', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const sortedClaims = response.data.claims.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
                setClaims(sortedClaims);
            } catch (err) {
                console.error('Error fetching claims:', err);
                if (err.response && err.response.status === 403) {
                    setError('Access Denied: You do not have permission to view claims. Please ensure you are logged in as an Admin or Agent.');
                } else if (err.response && err.response.data && err.response.data.error) {
                    setError(err.response.data.error);
                } else {
                    setError('Failed to fetch claims. Please check your network connection and try again.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchAllClaims();

        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleViewDetails = (claim) => {
        setSelectedClaim(claim);
        setReviewStatus(claim.status || 'Pending');
    };

    const handleReviewStatusChange = (event) => {
        setReviewStatus(event.target.value);
    };

    const handleUpdateStatus = async () => {
        if (!selectedClaim) return;

        setLoading(true);
        setError('');

        try {
            let message = `Claim with ID ${selectedClaim.claimId} status updated to ${reviewStatus}`;
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authentication required. Please log in.');
                setLoading(false);
                return;
            }

            await axios.put(`http://localhost:5000/api/claims/${selectedClaim.claimId}/status`,
                { status: reviewStatus },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            const updatedClaims = claims.map((claim) =>
                claim.claimId === selectedClaim.claimId ? { ...claim, status: reviewStatus } : claim
            );
            setClaims(updatedClaims);
            setSelectedClaim(prev => ({ ...prev, status: reviewStatus }));
            alert('Claim status updated successfully!');
            await axios.post("http://localhost:5000/api/activity", { text: message });
        } catch (err) {
            console.error('Error updating claim status:', err);
            if (err.response && err.response.status === 403) {
                setError('Access Denied: You do not have permission to update claims.');
            } else if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error);
            } else {
                setError('Failed to update claim status. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClaim = async (claimToDelete) => {
        if (!window.confirm(`Are you sure you want to delete Claim ID: ${claimToDelete.claimId}? This action cannot be undone.`)) {
            return;
        }

        setLoading(true);
        setError('');

        try {
            let message = `Claim with ID ${claimToDelete.claimId} was deleted`;
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authentication required. Please log in.');
                setLoading(false);
                return;
            }

            await axios.delete(`http://localhost:5000/api/claims/${claimToDelete.claimId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const updatedClaims = claims.filter((claim) => claim.claimId !== claimToDelete.claimId);
            setClaims(updatedClaims);
            if (selectedClaim?.claimId === claimToDelete.claimId) {
                setSelectedClaim(null);
            }
            alert('Claim deleted successfully!');
            await axios.post("http://localhost:5000/api/activity", { text: message });
        } catch (err) {
            console.error('Error deleting claim:', err);
            if (err.response && err.response.status === 403) {
                setError('Access Denied: You do not have permission to delete claims.');
            } else if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error);
            } else {
                setError('Failed to delete claim. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCloseReview = () => {
        setSelectedClaim(null);
        setError('');
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'Approved':
            case 'Settled':
                return 'bg-success';
            case 'Pending':
                return 'bg-warning text-dark';
            case 'Rejected':
                return 'bg-danger';
            case 'Under Review':
                return 'bg-info text-dark'; 
            default:
                return 'bg-secondary'; 
        }
    };

    const isClaimFinal = selectedClaim && (selectedClaim.status === 'Approved' || selectedClaim.status === 'Settled' || selectedClaim.status === 'Rejected');

    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading claims...</span>
                </div>
                <p className="mt-2">Loading claims...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-5 alert alert-danger text-center">
                {error}
            </div>
        );
    }

    if (claims.length === 0) {
        return <div className="container mt-5 alert alert-info text-center">No claims found.</div>;
    }

    return (
        <div className="container" style={{ marginTop: "100px" }}>
            <h2 className="mb-4 text-center text-primary fw-bold">Review All Claims</h2>
            <div className="table-responsive d-none d-md-block">
                <table className="table table-bordered align-middle" style={{ borderColor: "var(--primary)" }}>
                    <thead className="text-center">
                        <tr>
                            <th>User Name</th>
                            <th>Claim ID</th>
                            <th>Policy Name</th>
                            <th>Policy Number</th>
                            <th>Description</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Submitted Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {claims.map((claim) => (
                            <tr key={claim.claimId}>
                                <td>{claim.username || 'N/A'}</td> 
                                <td>{claim.claimId}</td>
                                <td>{claim.policyName || 'N/A'}</td> 
                                <td>{claim.policyNumber || 'N/A'}</td>
                                <td className="text-start">{claim.incidentDetails}</td>
                                <td>${claim.amount}</td>
                                <td>
                                    <span className={`badge ${getStatusBadgeClass(claim.status)}`}>
                                        {claim.status}
                                    </span>
                                </td>
                                <td>{new Date(claim.submittedAt).toLocaleDateString()}</td>
                                <td>
                                    {userRole === 'admin' || userRole === 'agent' ? (
                                        <>
                                            <button className="btn btn-sm" onClick={() => handleViewDetails(claim)} disabled={loading} title="View Details">
                                                <i className="bi bi-eye-fill text-primary fs-5"></i>
                                            </button>
                                            <button className="btn btn-sm ms-2" onClick={() => handleDeleteClaim(claim)} disabled={loading} title="Delete Claim">
                                                <i className="bi bi-trash-fill text-danger fs-5"></i>
                                            </button>
                                        </>
                                    ) : (
                                        <span className="text-muted fst-italic">No actions</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="d-md-none mt-4">
                {claims.map((claim) => (
                    <div className="card mb-3 shadow-sm" key={claim.claimId}>
                        <div className="card-body">
                            <h5 className="card-title text-primary fw-bold mb-2">
                                Claim ID: {claim.claimId}
                                <span className={`badge ${getStatusBadgeClass(claim.status)} float-end`}>
                                    {claim.status}
                                </span>
                            </h5>
                            <p className="card-text mb-1">
                                <strong>User:</strong> {claim.username || 'N/A'} 
                            </p>
                            <p className="card-text mb-1">
                                <strong>Policy Name:</strong> {claim.policyName || 'N/A'} 
                            </p>
                            <p className="card-text mb-1">
                                <strong>Policy Number:</strong> {claim.policyNumber || 'N/A'}
                            </p>
                            <p className="card-text mb-1">
                                <strong>Amount:</strong> ${claim.amount}
                            </p>
                            <p className="card-text mb-1">
                                <strong>Submitted On:</strong> {new Date(claim.submittedAt).toLocaleDateString()}
                            </p>
                            <p className="card-text mb-2">
                                <strong>Description:</strong> {claim.incidentDetails}
                            </p>
                            <div className="d-flex justify-content-end align-items-center">
                                {userRole === 'admin' || userRole === 'agent' ? (
                                    <>
                                        <button className="btn btn-outline-primary btn-sm me-2" onClick={() => handleViewDetails(claim)} disabled={loading}>
                                            <i className="bi bi-eye-fill me-1"></i> View Details
                                        </button>
                                        <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteClaim(claim)} disabled={loading}>
                                            <i className="bi bi-trash-fill me-1"></i> Delete
                                        </button>
                                    </>
                                ) : (
                                    <span className="text-muted small fst-italic">No actions available</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {selectedClaim && (
                <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">
                            <div className="modal-header bg-light">
                                <h5 className="modal-title">Review Claim: {selectedClaim.claimId}</h5>
                                <button type="button" className="btn-close" onClick={handleCloseReview} aria-label="Close" disabled={loading}></button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <p><strong>User:</strong> {selectedClaim.username || 'N/A'}</p> 
                                        <p><strong>Claim ID:</strong> {selectedClaim.claimId}</p>
                                        <p><strong>Policy Name:</strong> {selectedClaim.policyName || 'N/A'}</p> 
                                        <p><strong>Policy Number:</strong> {selectedClaim.policyNumber || 'N/A'}</p>
                                        <p><strong>Incident Date:</strong> {new Date(selectedClaim.incidentDate).toLocaleDateString()}</p>
                                    </div>
                                    <div className="col-md-6">
                                        <p><strong>Amount:</strong> ${selectedClaim.amount}</p>
                                        <p><strong>Submitted On:</strong> {new Date(selectedClaim.submittedAt).toLocaleString()}</p>
                                        {selectedClaim.supportingDocuments && selectedClaim.supportingDocuments.length > 0 && (
                                            <p><strong>Supporting Documents:</strong> {selectedClaim.supportingDocuments.join(', ')}</p>
                                        )}
                                    </div>
                                </div>
                                <hr />
                                <p><strong>Incident Details:</strong> {selectedClaim.incidentDetails}</p>

                                {(userRole === 'admin' || userRole === 'agent') ? (
                                    <div className="mb-3 mt-4">
                                        <label htmlFor="reviewStatus" className="form-label fw-semibold">Update Status:</label>
                                        <select
                                            className="form-select"
                                            id="reviewStatus"
                                            value={reviewStatus}
                                            onChange={handleReviewStatusChange}
                                            disabled={loading || isClaimFinal}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Under Review">Under Review</option>
                                            <option value="Approved">Approved</option>
                                            <option value="Rejected">Rejected</option>
                                            <option value="Settled">Settled</option>
                                        </select>
                                    </div>
                                ) : (
                                    <p className="mt-3 text-muted">
                                        <strong>Current Status:</strong> <span className={`badge ${getStatusBadgeClass(selectedClaim.status)}`}>{selectedClaim.status}</span>
                                    </p>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseReview} disabled={loading}>
                                    Close
                                </button>
                                {(userRole === 'admin' || userRole === 'agent') && (
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={handleUpdateStatus}
                                        disabled={loading || isClaimFinal}
                                    >
                                        {loading ? (
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        ) : (
                                            'Update Status'
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReviewClaims;