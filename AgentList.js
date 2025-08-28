import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import AgentForm from './AgentForm'; 

const AgentList = ({ onEdit }) => {
  const [agents, setAgents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const agentsPerPage = 5; 

  useEffect(() => {
    document.body.style.overflow = showModal ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showModal]);

  useEffect(() => {
    fetchAgents();
  }, []); 

  const fetchAgents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/agents');
      setAgents(response.data);
      if (currentPage * agentsPerPage >= response.data.length && response.data.length > 0) {
        setCurrentPage(0);
      }
    } catch (error) {
      console.error("Error fetching agents:", error);
    }
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const paginatedAgents = agents.slice(
    currentPage * agentsPerPage,
    (currentPage + 1) * agentsPerPage
  );

  const handleEditClick = (agent) => {
    setSelectedAgent(agent);
    onEdit(agent); 
    setShowModal(true);
  };

  const handleDelete = async (agentId) => {
    if (!window.confirm(`Are you sure you want to delete agent with ID: ${agentId}?`)) {
      return; 
    }
    const message = `Agent with ID ${agentId} was deleted`;
    try {
      await axios.delete(`http://localhost:5000/api/agents/${agentId}`);
      await axios.post("http://localhost:5000/api/activity", { text: message }); 
      fetchAgents(); 
      alert(`Agent with ID ${agentId} has been deleted.`);
    } catch (error) {
      console.error("Error deleting agent:", error);
      alert("Error deleting agent. Please try again."); 
    }
  };

  
  const handleAgentFormSubmit = () => {
    setShowModal(false);
    setSelectedAgent(null); 
    fetchAgents(); 
  };

  
  const PaginationControls = () => (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
      <ReactPaginate
        pageCount={Math.ceil(agents.length / agentsPerPage)}
        onPageChange={handlePageClick}
        containerClassName={'pagination'}
        activeClassName={'active'}
        pageClassName={'page-item'}
        pageLinkClassName={'page-link'}
        previousLinkClassName={'d-none'} 
        nextLinkClassName={'d-none'}     
        breakClassName={'page-item'}
        breakLinkClassName={'page-link'}
        renderOnZeroPageCount={null}
        pageLinkStyle={{
          padding: '10px 14px',
          margin: '0 5px',
          fontSize: '16px',
          fontWeight: '600',
          borderRadius: '5px',
          border: '1px solid #ccc',
          backgroundColor: '#fff',
          color: '#333',
          cursor: 'pointer',
          transition: '0.3s',
        }}
      />
    </div>
  );

  return (
    <>
      <div className="table-responsive d-none d-md-block">
        <table className="table table-bordered rounded" style={{ borderColor: "var(--primary)", tableLayout: 'fixed', width: '100%' }}>
          <thead className="text-center">
            <tr>
              <th style={{ width: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Name</th>
              <th style={{ width: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Email</th>
              <th style={{ width: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Phone</th>
              <th style={{ width: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Username</th>
              <th style={{ width: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Status</th>
              <th style={{ width: '120px' }}>Actions</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {paginatedAgents.map((agent) => (
              <tr key={agent._id}>
                <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{agent.username.replace('@agent', '')}</td>
                <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{agent.email}</td>
                <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{agent.mobile}</td>
                <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{agent.username}</td>
                <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{agent.status}</td>
                <td>
                  <button className="btn btn-sm me-2" onClick={() => handleEditClick(agent)} title="Edit">✏️</button>
                  <button className="btn btn-sm" onClick={() => handleDelete(agent._id)} title="Delete">🗑️</button>
                </td>
              </tr>
            ))}
            {paginatedAgents.length === 0 && (
                <tr>
                    <td colSpan="6" className="text-center">No agents found.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="d-md-none mt-3">
        {paginatedAgents.length > 0 ? (
          paginatedAgents.map((agent) => (
            <div key={agent._id} className="card mb-3 shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-2">
                  <i className="bi bi-person-fill me-2"></i>
                  {agent.username.replace('@agent', '')}
                </h5>
                <p className="card-text mb-1">
                  <strong>Email:</strong> {agent.email}
                </p>
                <p className="card-text mb-1">
                  <strong>Phone:</strong> {agent.mobile}
                </p>
                <p className="card-text mb-1">
                  <strong>Username:</strong> {agent.username}
                </p>
                <p className="card-text mb-3">
                  <strong>Status:</strong> <span className={`badge ${agent.status === 'Active' ? 'bg-success' : 'bg-warning text-dark'}`}>{agent.status}</span>
                </p>
                <div className="d-flex justify-content-end">
                  <button className="btn btn-primary btn-sm me-2" onClick={() => handleEditClick(agent)}>
                    <i className="bi bi-pencil-square"></i> Edit
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(agent._id)}>
                    <i className="bi bi-trash"></i> Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No agents found.</p>
        )}
      </div>

      {agents.length > agentsPerPage && <PaginationControls />}

      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Agent</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <AgentForm onSubmit={handleAgentFormSubmit} selectedAgent={selectedAgent} action="edit" />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AgentList;