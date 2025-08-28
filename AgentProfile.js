import React, { useEffect, useState } from "react";
import axios from "axios";

const AgentProfile = () => {
  const storedAgent = JSON.parse(localStorage.getItem("authUser") || "{}");
  const username = storedAgent.username;
  const [agent, setAgent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updatedAgent, setUpdatedAgent] = useState({});

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/${username}`);
        setAgent(response.data);
        setUpdatedAgent(response.data);
      } catch (error) {
        console.error("Error fetching agent profile:", error);
      }
    };
    if (username) fetchAgent();
  }, [username]);

  const handleChange = (e) => {
    setUpdatedAgent({ ...updatedAgent, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5000/api/users/${username}`, updatedAgent);
      setAgent(updatedAgent);
      setShowModal(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <>
      <div className="card shadow-sm border-0 p-3 p-md-4 mx-auto w-100 w-md-75">
        <div className="card-header bg-light text-primary fw-bold fs-5 d-flex justify-content-between align-items-center flex-wrap">
          Agent Profile
          <button className="btn btn-sm btn-outline-primary mt-2 mt-md-0" onClick={() => setShowModal(true)}>
            <i className="bi bi-pencil-square me-1"></i> Edit
          </button>
        </div>
        <div className="card-body">
          {agent ? (
            <>
              <div className="mb-3"><strong>Name:</strong> {agent.username}</div>
              <div className="mb-3"><strong>Email:</strong> {agent.email}</div>
              <div className="mb-3"><strong>Phone:</strong> {agent.mobile}</div>
              <div className="mb-3"><strong>Status:</strong> {agent.status}</div>
            </>
          ) : (
            <p>Loading agent profile...</p>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Profile</h5>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="username"
                    value={updatedAgent.username || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={updatedAgent.email || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    name="mobile"
                    value={updatedAgent.mobile || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleSave}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AgentProfile;
