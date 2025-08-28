import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import CustomerForm from './CustomerForm';

const CustomerList = ({ onEdit }) => {
    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const customersPerPage = 5;
    const [showModal, setShowModal] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        fetchCustomers();
        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);
        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    const checkIfMobile = () => {
        setIsMobile(window.innerWidth <= 768);
    };

    const fetchCustomers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/customers');
            setCustomers(response.data);
        } catch (error) {
            console.error("Error fetching customers:", error);
        }
    };

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    const handleEditClick = (customer) => {
        const formattedDOB = customer.dateofbirth ? new Date(customer.dateofbirth).toISOString().split('T')[0] : '';
        setSelectedCustomer({ ...customer, dateofbirth: formattedDOB });
        setShowModal(true);
    };

    const handleDelete = async (customerId) => {
        let message = `Customer with ID ${customerId} was deleted`;
        try {
            await axios.delete(`http://localhost:5000/api/customers/${customerId}`);
            fetchCustomers();
            alert(`Customer with ID ${customerId} has been deleted`);
        } catch (error) {
            console.error("Error deleting customer:", error);
        }
        axios.post("http://localhost:5000/api/activity", { text: message });
    };

    const calculateAge = (dob) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();

        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const paginatedCustomers = customers.slice(
        currentPage * customersPerPage,
        (currentPage + 1) * customersPerPage
    );

    return (
        <div className="container-fluid py-3">
            {isMobile ? (
                <div className="d-md-none mt-3">
                    {paginatedCustomers.length > 0 ? (
                        paginatedCustomers.map((cust) => (
                            <div key={cust._id} className="card mb-3 shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title mb-2">
                                        <i className="bi bi-person-fill me-2"></i>
                                        {cust.username}
                                    </h5>
                                    <p className="card-text mb-1">
                                        <strong>Email:</strong> {cust.email}
                                    </p>
                                    <p className="card-text mb-1">
                                        <strong>Phone:</strong> {cust.mobile}
                                    </p>
                                    <p className="card-text mb-1">
                                        <strong>Date Of Birth:</strong> {cust.dateofbirth ? new Date(cust.dateofbirth).toLocaleDateString() : 'N/A'}
                                    </p>
                                    <p className="card-text mb-1">
                                        <strong>Registered By:</strong> {cust.registeredBy || 'N/A'}
                                    </p>

                                    <div className="d-flex justify-content-end">
                                        <button className="btn btn-primary btn-sm me-2" onClick={() => handleEditClick(cust)}>
                                            <i className="bi bi-pencil-square"></i> Edit
                                        </button>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(cust._id)}>
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
            ) : (
                <div className="table-responsive">
                    <table className="table table-bordered rounded" style={{ borderColor: "var(--primary)" }}>
                        <thead className="text-center">
                            <tr>
                                <th style={{ width: '150px', wordWrap: 'break-word', overflow: 'hidden' }}>Username</th>
                                <th style={{ width: '200px', wordWrap: 'break-word', overflow: 'hidden' }}>Email</th>
                                <th style={{ width: '150px', wordWrap: 'break-word', overflow: 'hidden' }}>DOB</th>
                                <th style={{ width: '100px' }}>Age</th>
                                <th style={{ width: '150px', wordWrap: 'break-word', overflow: 'hidden' }}>Phone</th>
                                <th style={{ width: '200px', wordWrap: 'break-word', overflow: 'hidden' }}>Password</th>
                                <th style={{ width: '150px', wordWrap: 'break-word', overflow: 'hidden' }}>Registered By</th>
                                <th style={{ width: '150px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {paginatedCustomers.map((cust) => (
                                <tr key={cust._id}>
                                    <td style={{ wordWrap: 'break-word' }}>{cust.username}</td>
                                    <td style={{ wordWrap: 'break-word' }}>{cust.email}</td>
                                    <td>{new Date(cust.dateofbirth).toLocaleDateString()}</td>
                                    <td>{calculateAge(cust.dateofbirth)}</td>
                                    <td style={{ wordWrap: 'break-word' }}>{cust.mobile}</td>
                                    <td style={{ wordWrap: 'break-word' }}>{cust.password}</td>
                                    <td style={{ wordWrap: 'break-word' }}>{cust.registeredBy || 'N/A'}</td>
                                    <td>
                                        <button className="btn btn-sm me-2" onClick={() => handleEditClick(cust)}>✏️</button>
                                        <button className="btn btn-sm" onClick={() => handleDelete(cust._id)}>🗑️</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="d-flex justify-content-center mt-4">
                <ReactPaginate
                    pageCount={Math.ceil(customers.length / customersPerPage)}
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
                        transition: 'background-color 0.3s, color 0.3s',
                    }}
                    activeLinkClassName="bg-primary text-white border-primary"
                />
            </div>

            {showModal && (
                <div className="modal fade show d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Customer</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <CustomerForm onSubmit={fetchCustomers} selectedCustomer={selectedCustomer} action="edit" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerList;