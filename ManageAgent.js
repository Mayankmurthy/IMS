import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AgentForm from './AgentForm';
import AgentList from './AgentList';
 
function ManageAgent() {
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [hovered, setHovered] = useState(false);
 
  useEffect(() => {
    document.body.style.overflow = showModal ? 'hidden' : 'auto';
  }, [showModal]);
 
  useEffect(() => {
    fetchAgents(); 
  }, []);
 
  const fetchAgents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/agents');
      setAgents(response.data); 
    } catch (error) {
      console.error("Error fetching agents:", error);
    }
  };
 
  const handleAddOrUpdate = async (agent) => {
    try {
      if (agent._id) {
        await axios.put(`http://localhost:5000/api/agents/${agent._id}`, agent);
      } else {
        const response = await axios.post('http://localhost:5000/api/agents', agent);
        setAgents((prevAgents) => [...prevAgents, response.data.agent]); 
      }
      setShowModal(false);
    } catch (error) {
      console.error("Error saving agent:", error);
    }
  };
 
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/agents/${id}`);
      setAgents((prevAgents) => prevAgents.filter((agent) => agent._id !== id)); 
      alert(`Agent with ID ${id} has been deleted`);
    } catch (error) {
      console.error("Error deleting agent:", error);
    }
  };
 
  const filteredAgents = agents.filter((agent) =>
    Object.values(agent).some((val) => val.toString().toLowerCase().includes(searchTerm.toLowerCase()))
  );
 
  return (
    <div className="container mt-5">
      <button style={{ backgroundColor: hovered ? "var(--primary)" : "var(--accent)" }}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              className="btn mb-3 float-end"
              onClick={() => { setSelectedAgent(null); setShowModal(true); }}>
        <i className="bi bi-plus-circle-fill"></i> Add Agent
      </button>
 
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedAgent ? "Edit Agent" : "Add Agent"}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <AgentForm onSubmit={() => { fetchAgents(); setShowModal(false); }} selectedAgent={selectedAgent} action={selectedAgent ? "edit" : "add"} />
              </div>
            </div>
          </div>
        </div>
      )}
 
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search Agents..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
 
      <AgentList
        agents={filteredAgents}
        onEdit={setSelectedAgent}
        onDelete={handleDelete}
        handleAddOrUpdate={handleAddOrUpdate}
      />
    </div>
  );
}
 
export default ManageAgent;