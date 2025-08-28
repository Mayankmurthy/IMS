
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import claimImg from '../../assets/claimform.jpg';
import axios from 'axios';

const ClaimSubmissionForm = () => {
    const [claimDetails, setClaimDetails] = useState({
        policyNumber: '',
        incidentDate: '',
        incidentDetails: '',
        amount: '',
        supportingDocuments: [],
    });
    const [submissionStatus, setSubmissionStatus] = useState('');
    const [submissionError, setSubmissionError] = useState('');
    const [submittedClaimId, setSubmittedClaimId] = useState(null);
    const [userPolicies, setUserPolicies] = useState([]); 
    const [policiesLoading, setPoliciesLoading] = useState(true);
    const [policiesError, setPoliciesError] = useState('');

    useEffect(() => {
        const fetchUserPolicies = async () => {
            setPoliciesLoading(true);
            setPoliciesError('');
            const authUser = localStorage.getItem('authUser');
            const token = localStorage.getItem('token');
            let username = null;

            if (authUser) {
                try {
                    username = JSON.parse(authUser).username;
                } catch (e) {
                    console.error("Failed to parse authUser from localStorage", e);
                    setPoliciesError('Authentication error. Please log in again.');
                    setPoliciesLoading(false);
                    localStorage.removeItem('token');
                    localStorage.removeItem('authUser');
                    return;
                }
            }

            if (!token || !username) {
                setPoliciesError('You must be logged in to view your policies.');
                setPoliciesLoading(false);
                return;
            }

            try {
                const response = await axios.get(`http://localhost:5000/api/users/${username}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const today = new Date();
                today.setHours(0, 0, 0, 0); 
                const activePolicies = (response.data.purchasedPolicies || []).filter(policy => {
                    if (!policy.validUntil) return false; 
                    const policyExpiryDate = new Date(policy.validUntil);
                    policyExpiryDate.setHours(23, 59, 59, 999); 
                    return policyExpiryDate >= today;
                });
                
                setUserPolicies(activePolicies); 
            } catch (error) {
                console.error('Error fetching user policies:', error);
                setPoliciesError('Failed to load your policies. Please try again.');
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('authUser');
                }
            } finally {
                setPoliciesLoading(false);
            }
        };

        fetchUserPolicies();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setClaimDetails({ ...claimDetails, [name]: value });
    };

    const handleFileChange = (event) => {
        setClaimDetails({
            ...claimDetails,
            supportingDocuments: Array.from(event.target.files), 
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmissionStatus('Submitting...');
        setSubmissionError('');
        setSubmittedClaimId(null);

        const token = localStorage.getItem('token');
        if (!token) {
            setSubmissionError('You must be logged in to submit a claim.');
            setSubmissionStatus('');
            return;
        }

        try {
            const dataToSend = {
                policyNumber: claimDetails.policyNumber,
                incidentDate: claimDetails.incidentDate,
                incidentDetails: claimDetails.incidentDetails,
                amount: parseFloat(claimDetails.amount),
                supportingDocuments: claimDetails.supportingDocuments.map(file => file.name),
            };

            const response = await axios.post('http://localhost:5000/api/claims', dataToSend, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            setSubmissionStatus(response.data.message);
            setSubmittedClaimId(response.data.claimId);
            setClaimDetails({ policyNumber: '', incidentDate: '', incidentDetails: '', amount: '', supportingDocuments: [] });

        } catch (error) {
            console.error('Claim submission error:', error);
            setSubmissionStatus('');
            if (error.response && error.response.data && error.response.data.error) {
                setSubmissionError(error.response.data.error);
            } else {
                setSubmissionError('An unexpected error occurred during submission.');
            }
        }
    };

    return (
        <div className="container py-5">
            <div className="row align-items-center">
                <div className="col-md-6 mb-4 mb-md-0 d-flex justify-content-center">
                    <img
                        src={claimImg}
                        alt="Claim Submission Illustration"
                        className="img-fluid rounded-4 shadow-lg"
                        style={{ maxHeight: '400px', objectFit: 'cover' }}
                    />
                </div>

                <div className="col-md-6">
                    <div className="card shadow-sm p-4">
                        <h3 className="mb-4 text-center">Submit Your Insurance Claim</h3>
                        <form onSubmit={handleSubmit}>                
                            <div className="mb-3">
                                <label htmlFor="policyNumber" className="form-label">Policy Number:</label>
                                {policiesLoading ? (
                                    <p className="text-muted">Loading policies...</p>
                                ) : policiesError ? (
                                    <div className="alert alert-warning">{policiesError}</div>
                                ) : (
                                    <select
                                        id="policyNumber"
                                        name="policyNumber"
                                        className="form-control"
                                        value={claimDetails.policyNumber}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select your policy</option>
                                        {userPolicies.length === 0 ? (
                                            <option disabled>No active policies available</option>
                                        ) : (
                                            userPolicies.map((policy) => (
                                                <option key={policy._id} value={policy.displayId}>
                                                    {policy.displayId} - {policy.policyName}
                                                    {policy.claimStatus && policy.claimStatus !== 'Not Claimed' && ` (${policy.claimStatus})`}
                                                </option>
                                            ))
                                        )}
                                    </select>
                                )}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="incidentDate" className="form-label">Date of Incident:</label>
                                <input
                                    type="date"
                                    id="incidentDate"
                                    name="incidentDate"
                                    className="form-control"
                                    value={claimDetails.incidentDate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="incidentDetails" className="form-label">Details of Incident:</label>
                                <textarea
                                    id="incidentDetails"
                                    name="incidentDetails"
                                    className="form-control"
                                    value={claimDetails.incidentDetails}
                                    onChange={handleChange}
                                    rows="4"
                                    required
                                ></textarea>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="amount" className="form-label">Amount:</label>
                                <input
                                    type="number"
                                    id="amount"
                                    name="amount"
                                    className="form-control"
                                    value={claimDetails.amount}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="supportingDocuments" className="form-label">Supporting Documents:</label>
                                <input
                                    type="file"
                                    id="supportingDocuments"
                                    name="supportingDocuments"
                                    className="form-control"
                                    multiple
                                    onChange={handleFileChange}
                                />
                                {claimDetails.supportingDocuments.length > 0 && (
                                    <p className="mt-2 small text-muted">
                                        Selected files: {claimDetails.supportingDocuments.map(file => file.name).join(', ')}
                                    </p>
                                )}
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary w-100"
                                disabled={submissionStatus === 'Submitting...' || policiesLoading || userPolicies.length === 0}
                            >
                                {submissionStatus === 'Submitting...' ? (
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                ) : (
                                    'Submit Claim'
                                )}
                            </button>
                            {submissionError && <div className="alert alert-danger mt-3">{submissionError}</div>}
                            {submissionStatus === 'Claim submitted successfully!' && (
                                <div className="alert alert-success mt-3">
                                    {submissionStatus} Your Claim ID is: <strong className="text-primary">{submittedClaimId}</strong>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClaimSubmissionForm;