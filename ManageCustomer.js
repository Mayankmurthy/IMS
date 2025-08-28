import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomerForm from './CustomerForm';
import CustomerList from './CustomerList';

function ManageCustomer() {
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [currentUserInfo, setCurrentUserInfo] = useState({ role: null, username: null }); 

    useEffect(() => {
        document.body.style.overflow = showModal ? 'hidden' : 'auto';
    }, [showModal]);

    useEffect(() => {
        fetchCustomers();
        const authUser = JSON.parse(localStorage.getItem('authUser'));
        if (authUser) {
            setCurrentUserInfo({
                role: authUser.role,
                username: authUser.username
            });
        }
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/customers');
            setCustomers(response.data);
        } catch (error) {
            console.error("Error fetching customers:", error);
        }
    };

    const handleAddOrUpdate = async (customer) => {
        try {
            let message = `${customer.username} was ${customer._id ? "updated" : "added"}`;
            if (customer._id) {
                await axios.put(`http://localhost:5000/api/customers/${customer._id}`, customer);
                setCustomers((prevCustomers) =>
                    prevCustomers.map((c) => (c._id === customer._id ? customer : c))
                );
            } else {
                const response = await axios.post('http://localhost:5000/api/customers', customer);
                setCustomers((prevCustomers) => [...prevCustomers, response.data]);
            }
            await axios.post("http://localhost:5000/api/activity", { text: message });
            setShowModal(false);
        } catch (error) {
            console.error("Error adding/updating customer:", error);
        }
    };

    const handleDelete = async (id) => {
        let message = `Customer with ID ${id} was deleted`;
        try {
            await axios.delete(`http://localhost:5000/api/customers/${id}`);
            fetchCustomers();
        } catch (error) {
            console.error("Error deleting customer:", error);
        }
        await axios.post("http://localhost:5000/api/activity", { text: message });
    };

    return (
        <div className="container mt-5">
            <button
                className="btn mb-3 float-end"
                onClick={() => {
                    setSelectedCustomer(null);
                    setShowModal(true);
                }}>
                <i className="bi bi-plus-circle-fill"></i> Add Customer
            </button>

            {showModal && (
                <div className="modal fade show d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add Customer</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <CustomerForm
                                    onSubmit={(data) => { handleAddOrUpdate(data); setShowModal(false); }}
                                    selectedCustomer={selectedCustomer}
                                    action="add"
                                    currentUserInfo={currentUserInfo} 
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <input type="text" className="form-control mb-3" placeholder="Search customers..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

            <CustomerList customers={customers} onEdit={setSelectedCustomer} onDelete={handleDelete} handleAddOrUpdate={handleAddOrUpdate} />
        </div>
    );
}

export default ManageCustomer;