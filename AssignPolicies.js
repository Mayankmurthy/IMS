import React, { useEffect, useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

const AssignPolicies = () => {
    const [agents, setAgents] = useState([]);
    const [policies, setPolicies] = useState([]);
    const [selectedAgent, setSelectedAgent] = useState("");
    const [selectedPolicy, setSelectedPolicy] = useState("");
    const [agentPolicyData, setAgentPolicyData] = useState([]);

    const fetchData = () => {
        axios.get("http://localhost:5000/api/assignagents/list")
            .then(res => setAgents(res.data))
            .catch(err => console.error("Error fetching agents:", err));

        axios.get("http://localhost:5000/api/fetchpolicies/list")
            .then(res => setPolicies(res.data))
            .catch(err => console.error("Error fetching policies:", err));

        axios.get("http://localhost:5000/api/assignagents/agents-with-policies")
            .then(res => {
                setAgentPolicyData(res.data);
            })
            .catch(err => console.error("Error fetching agent-policy data:", err));
    };

    useEffect(() => {
        fetchData();
    }, []);

    const assignPolicy = () => {
        if (!selectedAgent || !selectedPolicy) {
            return alert("Please select an agent and a policy.");
        }
        //----------------------------------------------------------------
        let message = `Policy with ID ${selectedPolicy} assigned to Agent: ${selectedAgent}`;
        //----------------------------------------------------------------
        axios.post("http://localhost:5000/api/assignagents/assign-policy", {
            agentUsername: selectedAgent,
            policyId: selectedPolicy,
        })
        .then(() => {
            alert("Policy assigned successfully!");
            setSelectedAgent("");
            setSelectedPolicy("");
            fetchData();
        })
        .catch(err => {
            if (err.response && err.response.status === 409) {
                alert(err.response.data.message);
            } else if (err.response && err.response.data && err.response.data.message) {
               
                alert(err.response.data.message);
            }
            else {
                
                alert("Error assigning policy. Please try again.");
                console.error("Error assigning policy:", err);
            }
        });
        //----------------------------------------------------------------
        axios.post("http://localhost:5000/api/activity", { text: message })
        //----------------------------------------------------------------
    };

    return (
        <div className="container mt-4">
            <h3 className="mb-4 text-center">Assign Policies to Agents</h3>

            <div className="card p-4 shadow-sm w-50 mx-auto mb-5">
                <div className="mb-3">
                    <label htmlFor="agentSelect" className="form-label">Select Agent:</label>
                    <select
                        id="agentSelect"
                        className="form-select"
                        value={selectedAgent}
                        onChange={(e) => setSelectedAgent(e.target.value)}
                    >
                        <option value="">-- Select Agent --</option>
                        {agents.map(agent => (
                            <option key={agent.username} value={agent.username}>
                                {agent.username}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label htmlFor="policySelect" className="form-label">Select Policy:</label>
                    <select
                        id="policySelect"
                        className="form-select"
                        value={selectedPolicy}
                        onChange={(e) => setSelectedPolicy(e.target.value)}
                    >
                        <option value="">-- Select Policy --</option>
                        {policies.map(policy => (
                            <option key={policy._id} value={policy._id}>
                                {policy.policyName}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    className="btn btn-primary w-50 mx-auto d-block"
                    onClick={assignPolicy}
                >
                    Assign Policy
                </button>
            </div>

            <h3 className="mb-3 text-center">Agent Policy Assignments</h3>
            {agentPolicyData.length > 0 ? (
                <div className="table-responsive" >
                    <table className="table table-bordered" style={{ borderColor: "var(--primary)" }}>
                        <thead className="">
                            <tr>
                                <th>Agent Name</th>
                                <th>Active Status</th>
                                <th>Assigned Policies</th>
                            </tr>
                        </thead>
                        <tbody>
                            {agentPolicyData.map(agent => {
                                return (
                                    <tr key={agent.username}>
                                        <td>{agent.username}</td>
                                        <td>
                                            {agent.status === 'Active' ? (
                                                <span className="text-success">
                                                    <i className="bi bi-check-circle-fill me-1"></i> Active
                                                </span>
                                            ) : (
                                                <span className="text-danger">
                                                    <i className="bi bi-x-circle-fill me-1"></i> Inactive
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            {agent.assignedPolicies && agent.assignedPolicies.length > 0 ? (
                                                <ul className="list-unstyled mb-0">
                                                    {agent.assignedPolicies.map(policy => (
                                                        <li key={policy._id}>{policy.policyName}</li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                "No policies assigned"
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-center text-muted">No agent policy data available.</p>
            )}
        </div>
    );
};

export default AssignPolicies;