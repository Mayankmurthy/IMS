
import React, { useEffect, useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css'; 

const AssignedPolicies = () => {
  const storedAgent = JSON.parse(localStorage.getItem("authUser") || "{}");
  const agentUsername = storedAgent.username;

  const [assignedPolicies, setAssignedPolicies] = useState([]);

  useEffect(() => {
    if (!agentUsername) {
      console.error("Agent username missing.");
      return;
    }

    axios.get("http://localhost:5000/api/assignagents/auth/policies", {
      headers: { username: agentUsername }, 
    })
    .then(res => setAssignedPolicies(res.data))
    .catch(err => console.error("Error fetching policies:", err));
  }, [agentUsername]);

  return (
    <div className="container mt-4"> 
      <h3 className="mb-4 text-center">Your Assigned Policies</h3> 

      <div className="row"> 
        {assignedPolicies.length === 0 ? (
          <div className="col-12">
            <p className="text-center text-muted">No policies assigned to you yet.</p>
          </div>
        ) : (
          assignedPolicies.map(policy => (
            <div key={policy._id} className="col-lg-4 col-md-6 col-sm-12 mb-4"> 
              <div className="card h-100 shadow-sm"> 
                <div className="card-body">
                  <h5 className="card-title text-primary">{policy.policyName}</h5>
                  {policy.policyDescription && <p className="card-text text-muted">{policy.policyDescription}</p>} 
                  <ul className="list-group list-group-flush mt-3"> 
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <strong>Premium:</strong>
                      <span className="badge bg-success rounded-pill">₹{policy.premium}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <strong>Category:</strong>
                      <span className="badge bg-info text-dark">{policy.category}</span>
                    </li>
                  </ul>
                  
                </div>
               
                <div className="card-footer text-muted">
                    Policy ID: {policy._id}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AssignedPolicies;