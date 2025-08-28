import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function MyCart() {
    const [boughtPolicies, setBoughtPolicies] = useState([]);
    const [filter, setFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchBoughtPolicies();
    }, []);

    const fetchBoughtPolicies = async () => {
        setLoading(true);
        setError(null);
        const username = localStorage.getItem("authUser");
        const name = username ? JSON.parse(username).username : null;

        if (!name) {
            setError("Please sign in to view your cart.");
            setLoading(false);
            setBoughtPolicies([]); 
            return;
        }

        try {
            
            const res = await fetch(`http://localhost:5000/api/users/${name}`);
            if (!res.ok) {
                if (res.status === 404) {
                    setError(`User "${name}" not found.`);
                    setBoughtPolicies([]);
                } else {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
            } else {
                const userData = await res.json();
                setBoughtPolicies(userData.purchasedPolicies || []);
            }
        } catch (err) {
            console.error("Error fetching bought policies:", err);
            setError("Failed to load policies. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const getFilteredPolicies = () => {
        if (filter === "auto") {
            return boughtPolicies.filter((p) => p.category === "auto");
        } else if (filter === "life") {
            return boughtPolicies.filter((p) => p.category === "life");
        }
        return boughtPolicies;
    };

    const totalPremium = getFilteredPolicies().reduce((sum, policy) => {
        const match = policy.premium.match(/\$([0-9]+)/);
        return sum + (match ? parseInt(match[1]) : 0);
    }, 0);

    const filteredPolicies = getFilteredPolicies();

  
    const getClaimStatusBadgeClass = (status) => {
        switch (status) {
            case "Pending":
                return "bg-warning text-dark";
            case "Approved":
                return "bg-success";
            case "Rejected":
                return "bg-danger";
            case "Under Review":
                return "bg-info text-dark";
            case "Settled":
                return "bg-primary";
            case "Not Claimed":
            default:
                return "bg-secondary";
        }
    };

   
    const getPolicyExpirationStatus = (validUntil) => {
      const today = new Date();
      const expirationDate = new Date(validUntil);

     
      if (isNaN(expirationDate.getTime())) {
          return { status: "Expired (Invalid Date)", class: "bg-danger" };
      }

      if (today > expirationDate) {
          return { status: "Expired", class: "bg-danger" };
      }
      return { status: "Active", class: "bg-success" };
  };


    if (loading) {
        return <div className="container py-5 text-center">Loading policies...</div>;
    }

    if (error) {
        return <div className="container py-5 text-center alert alert-danger">{error}</div>;
    }

    return (
        <div className="container py-5">
           
            <div className="bg-light p-5 rounded mb-5 text-center shadow-sm">
                <h1 className="fw-bold">My Insurance Cart</h1>
                <p className="text-muted">All your purchased policies in one place.</p>
            </div>

           
            <div className="row justify-content-center mb-4">
                <div className="col-12 col-md-6 col-lg-4">
                    <label className="form-label fw-semibold">Filter by Policy Type:</label>
                    <select
                        className="form-select shadow-sm"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="all">All</option>
                        <option value="auto">Auto Insurance</option>
                        <option value="life">Life Insurance</option>
                    </select>
                </div>
            </div>

           
            {filteredPolicies.length === 0 ? (
                <div className="alert alert-info text-center">
                    No policies found for the selected filter.
                </div>
            ) : (
                <>
                    <div className="row">
                        {filteredPolicies.map((policy) => {
                            const policyStatus = getPolicyExpirationStatus(policy.validUntil); 
                            return (
                                <div className="col-12 col-md-6 col-lg-4 mb-4" key={policy._id}>
                                    <div className="card h-100 border-0 shadow-sm">
                                        <div className="card-header bg-primary text-white fw-semibold">
                                            {policy.policyName}
                                        </div>
                                        <div className="card-body d-flex flex-column">
                                            <p className="text-muted">{policy.policyDescription}</p>
                                            <p><strong>Policy ID:</strong> {policy.displayId}</p>
                                            <ul className="list-unstyled small">
                                                <li><strong>Premium:</strong> {policy.premium}</li>
                                                <li><strong>Specs:</strong>
                                                    <ul className="ms-3">
                                                        {policy.policySpecs.map((spec, specIndex) => (
                                                            <li key={specIndex}>{spec}</li>
                                                        ))}
                                                    </ul>
                                                </li>
                                                <li><strong>Valid Until:</strong> {new Date(policy.validUntil).toLocaleDateString()}</li>
                                            </ul>
                                            <div className="mt-auto d-flex justify-content-between align-items-center">
                                                
                                                <span className={`badge ${policyStatus.class}`}>
                                                    {policyStatus.status}
                                                </span>
                                                
                                                {policy.claimStatus && (
                                                    <span className={`badge ${getClaimStatusBadgeClass(policy.claimStatus)} ms-2`}>
                                                        {policy.claimStatus}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    
                    <div className="text-center mt-5">
                        <h5 className="fw-semibold">
                            Total Premium: <span className="text-success">${totalPremium}/year</span>
                        </h5>
                    </div>
                </>
            )}
        </div>
    );
}